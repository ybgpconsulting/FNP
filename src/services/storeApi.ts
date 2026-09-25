import { INITIAL_CATEGORIES, INITIAL_DELIVERY_SETTINGS, INITIAL_HOMEPAGE_CONFIG, INITIAL_PRODUCTS, INITIAL_SETTINGS, STORE_MAPS_URL } from '../data/initialData';
import { Category, DeliverySettings, HomepageConfig, Product, RecordedOrder, StoreSettings } from '../types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const LS_KEYS = { products: 'fnp_noida76_products_v1', categories: 'fnp_noida76_categories_v1', settings: 'fnp_noida76_settings_v1', homepage: 'fnp_noida76_homepage_v1', delivery: 'fnp_noida76_delivery_settings_v1' };
const LEGACY_STORE_MAPS_URL = 'https://maps.google.com/?q=Amrapali+Crystal+Home+Sector+76+Noida+201301';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}/api/${path}`, { ...options, credentials: 'include', headers: { 'content-type': 'application/json', ...(options?.headers || {}) } });
  if (!response.ok) { const payload = await response.json().catch(() => null) as { error?: string } | null; throw new Error(payload?.error || `Request failed (${response.status})`); }
  return response.json() as Promise<T>;
}

function normalizeStoreSettings(settings: StoreSettings): StoreSettings {
  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/\D/g, '');
  const whatsappNumber = /^\d{10,15}$/.test(cleanWhatsAppNumber)
    ? cleanWhatsAppNumber
    : INITIAL_SETTINGS.whatsappNumber;
  return {
    ...settings,
    whatsappNumber,
    ...(settings.mapsUrl === LEGACY_STORE_MAPS_URL ? { mapsUrl: STORE_MAPS_URL } : {}),
  };
}
function readLocal<T>(key: string, fallback: T): T { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; } }
function writeLocal(key: string, value: unknown): void { localStorage.setItem(key, JSON.stringify(value)); }
function normalizeProduct(product: Product): Product { const legacy = product as Product & { flavorOptions?: string[]; selectedFlavor?: string }; const { flavorOptions: _flavorOptions, selectedFlavor: _selectedFlavor, ...normalized } = legacy; return normalized; }

export async function fetchProducts(): Promise<Product[]> { try { return (await request<Product[]>('products')).map(normalizeProduct); } catch { return readLocal(LS_KEYS.products, INITIAL_PRODUCTS).map(normalizeProduct); } }
export async function fetchProductBySlug(slug: string): Promise<Product | null> { try { return await request<Product>(`products/${encodeURIComponent(slug)}`); } catch { return (await fetchProducts()).find((product) => product.slug === slug) || null; } }
export async function saveProduct(product: Product): Promise<void> { await request('products', { method: 'PUT', body: JSON.stringify(product) }); }
export async function removeProduct(id: string): Promise<void> { await request(`products/${encodeURIComponent(id)}`, { method: 'DELETE' }); }

export async function fetchCategories(): Promise<Category[]> { try { return await request<Category[]>('categories'); } catch { return readLocal(LS_KEYS.categories, INITIAL_CATEGORIES); } }
export async function saveCategory(category: Category): Promise<void> { await request('categories', { method: 'PUT', body: JSON.stringify(category) }); }
export async function removeCategory(id: string): Promise<void> { await request(`categories/${encodeURIComponent(id)}`, { method: 'DELETE' }); }

export async function fetchStoreSettings(): Promise<StoreSettings> { try { const settings = await request<StoreSettings>('settings/store'); writeLocal(LS_KEYS.settings, settings); return normalizeStoreSettings(settings); } catch { return normalizeStoreSettings(readLocal(LS_KEYS.settings, INITIAL_SETTINGS)); } }
export async function saveStoreSettings(settings: StoreSettings): Promise<void> { await request('settings/store', { method: 'PUT', body: JSON.stringify(settings) }); writeLocal(LS_KEYS.settings, settings); }
export async function fetchHomepageConfig(): Promise<HomepageConfig> { try { const config = await request<HomepageConfig>('homepage/config'); writeLocal(LS_KEYS.homepage, config); return config; } catch { return readLocal(LS_KEYS.homepage, INITIAL_HOMEPAGE_CONFIG); } }
export async function saveHomepageConfig(config: HomepageConfig): Promise<void> { await request('homepage/config', { method: 'PUT', body: JSON.stringify(config) }); writeLocal(LS_KEYS.homepage, config); }
export async function fetchDeliverySettings(): Promise<DeliverySettings> { try { const settings = await request<DeliverySettings>('settings/delivery'); writeLocal(LS_KEYS.delivery, settings); return settings; } catch { return readLocal(LS_KEYS.delivery, INITIAL_DELIVERY_SETTINGS); } }
export async function saveDeliverySettings(settings: DeliverySettings): Promise<void> { await request('settings/delivery', { method: 'PUT', body: JSON.stringify(settings) }); writeLocal(LS_KEYS.delivery, settings); }

export async function logWhatsAppOrder(_order: Omit<RecordedOrder, 'id' | 'createdAt'>): Promise<string> { return `wa_${Date.now().toString(36)}`; }
export async function fetchRecordedOrders(): Promise<RecordedOrder[]> { return []; }
