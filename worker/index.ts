/// <reference types="@cloudflare/workers-types" />

import {
  INITIAL_CATEGORIES,
  INITIAL_DELIVERY_SETTINGS,
  INITIAL_HOMEPAGE_CONFIG,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
} from '../src/data/initialData';
import { Category, DeliverySettings, HomepageConfig, Product, StoreSettings } from '../src/types';

interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  ASSETS: Fetcher;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD_HASH: string;
  SESSION_SECRET: string;
}

type JsonObject = Record<string, unknown>;
const COOKIE_NAME = 'fnp_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function json(data: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  });
}

function error(message: string, status = 400): Response {
  return json({ error: message }, status);
}

function asBoolean(value: unknown): boolean {
  return value === true || value === 1;
}

function productFromRow(row: Record<string, unknown>): Product {
  return {
    id: String(row.id), name: String(row.name), slug: String(row.slug), description: String(row.description || ''),
    price: Number(row.price), oldPrice: row.old_price == null ? undefined : Number(row.old_price),
    categoryId: String(row.category_id), categoryName: row.category_name ? String(row.category_name) : undefined,
    categorySlug: row.category_slug ? String(row.category_slug) : undefined,
    images: JSON.parse(String(row.images_json || '[]')), featured: asBoolean(row.featured),
    bestseller: asBoolean(row.bestseller), available: asBoolean(row.available), displayOrder: Number(row.display_order),
    weightOptions: row.weight_options_json ? JSON.parse(String(row.weight_options_json)) : undefined,
    selectedWeight: row.selected_weight ? String(row.selected_weight) : undefined,
    allowCustomMessage: row.allow_custom_message == null ? undefined : asBoolean(row.allow_custom_message),
    customMessagePlaceholder: row.custom_message_placeholder ? String(row.custom_message_placeholder) : undefined,
    createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

function categoryFromRow(row: Record<string, unknown>): Category {
  return { id: String(row.id), name: String(row.name), slug: String(row.slug), description: String(row.description || ''), image: String(row.image || ''), active: asBoolean(row.active), displayOrder: Number(row.display_order) };
}

async function seedIfEmpty(env: Env): Promise<void> {
  const existing = await env.DB.prepare('SELECT id FROM products LIMIT 1').first();
  if (existing) return;
  const now = new Date().toISOString();
  const statements = [
    ...INITIAL_CATEGORIES.map((item) => env.DB.prepare('INSERT OR IGNORE INTO categories (id,name,slug,description,image,active,display_order) VALUES (?,?,?,?,?,?,?)').bind(item.id, item.name, item.slug, item.description, item.image, item.active ? 1 : 0, item.displayOrder)),
    ...INITIAL_PRODUCTS.map((item) => env.DB.prepare('INSERT OR IGNORE INTO products (id,name,slug,description,price,old_price,category_id,category_name,category_slug,images_json,featured,bestseller,available,display_order,weight_options_json,selected_weight,allow_custom_message,custom_message_placeholder,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(item.id, item.name, item.slug, item.description, item.price, item.oldPrice ?? null, item.categoryId, item.categoryName ?? null, item.categorySlug ?? null, JSON.stringify(item.images), item.featured ? 1 : 0, item.bestseller ? 1 : 0, item.available ? 1 : 0, item.displayOrder, item.weightOptions ? JSON.stringify(item.weightOptions) : null, item.selectedWeight ?? null, item.allowCustomMessage == null ? null : item.allowCustomMessage ? 1 : 0, item.customMessagePlaceholder ?? null, item.createdAt || now, item.updatedAt || now)),
    env.DB.prepare('INSERT OR IGNORE INTO settings (key,value_json,updated_at) VALUES (?,?,?)').bind('store', JSON.stringify(INITIAL_SETTINGS), now),
    env.DB.prepare('INSERT OR IGNORE INTO settings (key,value_json,updated_at) VALUES (?,?,?)').bind('delivery', JSON.stringify(INITIAL_DELIVERY_SETTINGS), now),
    env.DB.prepare('INSERT OR IGNORE INTO settings (key,value_json,updated_at) VALUES (?,?,?)').bind('homepage', JSON.stringify(INITIAL_HOMEPAGE_CONFIG), now),
  ];
  await env.DB.batch(statements);
}

async function setting<T>(env: Env, key: string, fallback: T): Promise<T> {
  const row = await env.DB.prepare('SELECT value_json FROM settings WHERE key = ?').bind(key).first<{ value_json: string }>();
  return row ? JSON.parse(row.value_json) as T : fallback;
}

function base64Url(bytes: ArrayBuffer | Uint8Array): string {
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = ''; data.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4);
  const binary = atob(padded); return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hmac(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return base64Url(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)));
}

async function createSession(env: Env, email: string): Promise<string> {
  const payload = base64Url(new TextEncoder().encode(JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS })));
  return `${payload}.${await hmac(payload, env.SESSION_SECRET)}`;
}

async function isAdmin(request: Request, env: Env): Promise<boolean> {
  const cookie = request.headers.get('Cookie')?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!cookie || !env.SESSION_SECRET) return false;
  const token = cookie.slice(COOKIE_NAME.length + 1).split('.');
  if (token.length !== 2 || (await hmac(token[0], env.SESSION_SECRET)).replace(/=+$/, '') !== token[1].replace(/=+$/, '')) return false;
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(token[0])));
    return payload.email === env.ADMIN_EMAIL.toLowerCase() && payload.exp > Math.floor(Date.now() / 1000);
  } catch { return false; }
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, iterationsText, saltText, hashText] = stored.split('$');
  if (algorithm !== 'pbkdf2_sha256' || !iterationsText || !saltText || !hashText) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const salt = new Uint8Array(fromBase64Url(saltText));
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: Number(iterationsText), hash: 'SHA-256' }, key, 256);
  const actual = base64Url(bits);
  return actual === hashText;
}

function sessionCookie(value: string, maxAge = SESSION_TTL_SECONDS): string {
  return `${COOKIE_NAME}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;
}

async function handleApi(request: Request, env: Env, url: URL): Promise<Response> {
  const path = url.pathname.replace(/^\/api\/?/, '');
  const method = request.method;

  if (path === 'auth/login' && method === 'POST') {
    const body = await request.json<{ email?: string; password?: string }>();
    if (!body.email || body.email.toLowerCase().trim() !== env.ADMIN_EMAIL.toLowerCase() || !body.password || !(await verifyPassword(body.password, env.ADMIN_PASSWORD_HASH))) return error('Invalid email or password.', 401);
    const session = await createSession(env, env.ADMIN_EMAIL.toLowerCase());
    return json({ user: { uid: 'cloudflare-admin', email: env.ADMIN_EMAIL, displayName: 'Store Admin', isAdmin: true } }, 200, { 'set-cookie': sessionCookie(session) });
  }
  if (path === 'auth/logout' && method === 'POST') return json({ ok: true }, 200, { 'set-cookie': sessionCookie('', 0) });
  if (path === 'auth/me' && method === 'GET') return (await isAdmin(request, env)) ? json({ user: { uid: 'cloudflare-admin', email: env.ADMIN_EMAIL, displayName: 'Store Admin', isAdmin: true } }) : error('Unauthorized', 401);
  if (path === 'auth/reset' && method === 'POST') return json({ ok: true });

  await seedIfEmpty(env);
  if (path === 'products' && method === 'GET') {
    const rows = await env.DB.prepare('SELECT * FROM products ORDER BY display_order ASC, name ASC').all();
    return json(rows.results.map(productFromRow));
  }
  if (path.startsWith('products/') && method === 'GET') {
    const row = await env.DB.prepare('SELECT * FROM products WHERE slug = ?').bind(decodeURIComponent(path.slice(9))).first<Record<string, unknown>>();
    return row ? json(productFromRow(row)) : error('Product not found', 404);
  }
  if (path === 'categories' && method === 'GET') {
    const rows = await env.DB.prepare('SELECT * FROM categories ORDER BY display_order ASC, name ASC').all();
    return json(rows.results.map(categoryFromRow));
  }
  if (path === 'settings/store' && method === 'GET') return json(await setting(env, 'store', INITIAL_SETTINGS));
  if (path === 'settings/delivery' && method === 'GET') return json(await setting(env, 'delivery', INITIAL_DELIVERY_SETTINGS));
  if (path === 'homepage/config' && method === 'GET') return json(await setting(env, 'homepage', INITIAL_HOMEPAGE_CONFIG));

  if (!(await isAdmin(request, env))) return error('Unauthorized', 401);
  const body = method === 'DELETE' ? null : await request.json<JsonObject>();
  const now = new Date().toISOString();

  if (path === 'products' && method === 'PUT' && body) {
    const item = body as unknown as Product;
    await env.DB.prepare('INSERT OR REPLACE INTO products (id,name,slug,description,price,old_price,category_id,category_name,category_slug,images_json,featured,bestseller,available,display_order,weight_options_json,selected_weight,allow_custom_message,custom_message_placeholder,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(item.id, item.name, item.slug, item.description, item.price, item.oldPrice ?? null, item.categoryId, item.categoryName ?? null, item.categorySlug ?? null, JSON.stringify(item.images), item.featured ? 1 : 0, item.bestseller ? 1 : 0, item.available ? 1 : 0, item.displayOrder, item.weightOptions ? JSON.stringify(item.weightOptions) : null, item.selectedWeight ?? null, item.allowCustomMessage == null ? null : item.allowCustomMessage ? 1 : 0, item.customMessagePlaceholder ?? null, item.createdAt || now, now).run();
    return json({ ok: true });
  }
  if (path.startsWith('products/') && method === 'DELETE') { await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(path.slice(9)).run(); return json({ ok: true }); }
  if (path === 'categories' && method === 'PUT' && body) {
    const item = body as unknown as Category;
    await env.DB.prepare('INSERT OR REPLACE INTO categories (id,name,slug,description,image,active,display_order) VALUES (?,?,?,?,?,?,?)').bind(item.id, item.name, item.slug, item.description, item.image, item.active ? 1 : 0, item.displayOrder).run();
    return json({ ok: true });
  }
  if (path.startsWith('categories/') && method === 'DELETE') { await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(path.slice(11)).run(); return json({ ok: true }); }
  if (path === 'settings/store' && method === 'PUT' && body) return saveSetting(env, 'store', body);
  if (path === 'settings/delivery' && method === 'PUT' && body) return saveSetting(env, 'delivery', body);
  if (path === 'homepage/config' && method === 'PUT' && body) return saveSetting(env, 'homepage', body);
  return error('Not found', 404);
}

async function saveSetting(env: Env, key: string, value: JsonObject): Promise<Response> {
  await env.DB.prepare('INSERT OR REPLACE INTO settings (key,value_json,updated_at) VALUES (?,?,?)').bind(key, JSON.stringify(value), new Date().toISOString()).run();
  return json({ ok: true });
}

async function handleMedia(request: Request, env: Env, url: URL): Promise<Response> {
  if (url.pathname.startsWith('/media/') && request.method === 'GET') {
    const object = await env.MEDIA.get(url.pathname.slice(7));
    return object ? new Response(object.body, { headers: { 'content-type': object.httpMetadata?.contentType || 'application/octet-stream', 'cache-control': 'public, max-age=31536000, immutable' } }) : error('Media not found', 404);
  }
  if (!(await isAdmin(request, env))) return error('Unauthorized', 401);
  if (url.pathname === '/api/media/upload' && request.method === 'POST') {
    const form = await request.formData(); const file = form.get('file'); const folder = String(form.get('folder') || 'products');
    if (!(file instanceof File)) return error('Image file is required.');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_'); const key = `${folder}/${crypto.randomUUID()}-${safeName}`;
    await env.MEDIA.put(key, file.stream(), { httpMetadata: { contentType: file.type || 'image/jpeg' } });
    return json({ url: `${url.origin}/media/${key}`, key });
  }
  if (url.pathname === '/api/media' && request.method === 'DELETE') {
    const body = await request.json<{ key?: string }>(); if (!body.key) return error('Media key is required.');
    await env.MEDIA.delete(body.key); return json({ ok: true });
  }
  return error('Not found', 404);
}

export default { async fetch(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  try {
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/media/')) return url.pathname.startsWith('/media/') || url.pathname === '/api/media' || url.pathname === '/api/media/upload' ? handleMedia(request, env, url) : handleApi(request, env, url);
    return env.ASSETS.fetch(request);
  } catch (err) { console.error(err); return error('Internal server error', 500); }
} };
