import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  INITIAL_CATEGORIES,
  INITIAL_HOMEPAGE_CONFIG,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
} from '../data/initialData';
import { Category, HomepageConfig, Product, RecordedOrder, StoreSettings } from '../types';
import { auth, db, isFirebaseConfigured } from './config';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error Logged:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Local storage keys for resilient fallback
const LS_PRODUCTS_KEY = 'fnp_noida76_products_v1';
const LS_CATEGORIES_KEY = 'fnp_noida76_categories_v1';
const LS_SETTINGS_KEY = 'fnp_noida76_settings_v1';
const LS_HOMEPAGE_KEY = 'fnp_noida76_homepage_v1';
const LS_ORDERS_KEY = 'fnp_noida76_orders_v1';

// Seed initial data into localStorage if empty
function initLocalStorage() {
  if (!localStorage.getItem(LS_PRODUCTS_KEY)) {
    localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(LS_CATEGORIES_KEY)) {
    localStorage.setItem(LS_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(LS_SETTINGS_KEY)) {
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
  }
  if (!localStorage.getItem(LS_HOMEPAGE_KEY)) {
    localStorage.setItem(LS_HOMEPAGE_KEY, JSON.stringify(INITIAL_HOMEPAGE_CONFIG));
  }
}
initLocalStorage();

// ===================== PRODUCTS =====================

export async function fetchProducts(): Promise<Product[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'products'), orderBy('displayOrder', 'asc'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        // First-time seed into live Firestore
        await seedFirestoreIfEmpty();
        return INITIAL_PRODUCTS;
      }
      return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, 'id'>) }));
    } catch (err) {
      console.warn('Firestore fetchProducts fallback to local data:', err);
      // Fallback
    }
  }

  const raw = localStorage.getItem(LS_PRODUCTS_KEY);
  return raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'products'), where('slug', '==', slug));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        return { id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) };
      }
    } catch (err) {
      console.warn('Firestore fetchProductBySlug error, using fallback:', err);
    }
  }

  const products = await fetchProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function saveProduct(product: Product): Promise<void> {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'products', product.id);
      await setDoc(docRef, {
        ...product,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `products/${product.id}`);
    }
  }

  // Also update local cache
  const products = await fetchProducts();
  const index = products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    products[index] = { ...product, updatedAt: new Date().toISOString() };
  } else {
    products.push({
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(products));
}

export async function removeProduct(productId: string): Promise<void> {
  if (isFirebaseConfigured() && db) {
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
    }
  }

  const products = await fetchProducts();
  const filtered = products.filter((p) => p.id !== productId);
  localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(filtered));
}

// ===================== CATEGORIES =====================

export async function fetchCategories(): Promise<Category[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'categories'), orderBy('displayOrder', 'asc'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return INITIAL_CATEGORIES;
      }
      return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Category, 'id'>) }));
    } catch (err) {
      console.warn('Firestore fetchCategories fallback to local data:', err);
    }
  }

  const raw = localStorage.getItem(LS_CATEGORIES_KEY);
  return raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
}

export async function saveCategory(category: Category): Promise<void> {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'categories', category.id);
      await setDoc(docRef, category);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `categories/${category.id}`);
    }
  }

  const categories = await fetchCategories();
  const index = categories.findIndex((c) => c.id === category.id);
  if (index >= 0) {
    categories[index] = category;
  } else {
    categories.push(category);
  }
  localStorage.setItem(LS_CATEGORIES_KEY, JSON.stringify(categories));
}

export async function removeCategory(categoryId: string): Promise<void> {
  if (isFirebaseConfigured() && db) {
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `categories/${categoryId}`);
    }
  }

  const categories = await fetchCategories();
  const filtered = categories.filter((c) => c.id !== categoryId);
  localStorage.setItem(LS_CATEGORIES_KEY, JSON.stringify(filtered));
}

// ===================== SETTINGS =====================

export async function fetchStoreSettings(): Promise<StoreSettings> {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'settings', 'store');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as StoreSettings;
      }
    } catch (err) {
      console.warn('Firestore fetchStoreSettings fallback:', err);
    }
  }

  const raw = localStorage.getItem(LS_SETTINGS_KEY);
  return raw ? JSON.parse(raw) : INITIAL_SETTINGS;
}

export async function saveStoreSettings(settings: StoreSettings): Promise<void> {
  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, 'settings', 'store'), settings);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/store');
    }
  }

  localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings));
}

// ===================== HOMEPAGE CMS =====================

export async function fetchHomepageConfig(): Promise<HomepageConfig> {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'homepage', 'config');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as HomepageConfig;
      }
    } catch (err) {
      console.warn('Firestore fetchHomepageConfig fallback:', err);
    }
  }

  const raw = localStorage.getItem(LS_HOMEPAGE_KEY);
  return raw ? JSON.parse(raw) : INITIAL_HOMEPAGE_CONFIG;
}

export async function saveHomepageConfig(config: HomepageConfig): Promise<void> {
  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, 'homepage', 'config'), config);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'homepage/config');
    }
  }

  localStorage.setItem(LS_HOMEPAGE_KEY, JSON.stringify(config));
}

// ===================== ORDERS LOG (Optional Tracking) =====================

export async function logWhatsAppOrder(order: Omit<RecordedOrder, 'id' | 'createdAt'>): Promise<string> {
  const orderId = 'ord_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  const fullOrder: RecordedOrder = {
    ...order,
    id: orderId,
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, 'orders', orderId), fullOrder);
    } catch (err) {
      console.warn('Could not write order log to Firestore (non-fatal):', err);
    }
  }

  const existingRaw = localStorage.getItem(LS_ORDERS_KEY);
  const orders: RecordedOrder[] = existingRaw ? JSON.parse(existingRaw) : [];
  orders.unshift(fullOrder);
  localStorage.setItem(LS_ORDERS_KEY, JSON.stringify(orders.slice(0, 100)));

  return orderId;
}

export async function fetchRecordedOrders(): Promise<RecordedOrder[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<RecordedOrder, 'id'>) }));
      }
    } catch (err) {
      console.warn('Could not read orders from Firestore (non-fatal):', err);
    }
  }

  const raw = localStorage.getItem(LS_ORDERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

// ===================== SEED DATA HELPER =====================

export async function seedFirestoreIfEmpty(): Promise<void> {
  if (!isFirebaseConfigured() || !db) return;

  try {
    const productsSnap = await getDocs(collection(db, 'products'));
    if (!productsSnap.empty) return;

    console.log('Seeding initial products, categories and settings to Firestore...');
    const batch = writeBatch(db);

    // Seed categories
    for (const cat of INITIAL_CATEGORIES) {
      batch.set(doc(db, 'categories', cat.id), cat);
    }

    // Seed products
    for (const prod of INITIAL_PRODUCTS) {
      batch.set(doc(db, 'products', prod.id), prod);
    }

    // Seed settings & homepage
    batch.set(doc(db, 'settings', 'store'), INITIAL_SETTINGS);
    batch.set(doc(db, 'homepage', 'config'), INITIAL_HOMEPAGE_CONFIG);

    await batch.commit();
    console.log('Firestore seed completed successfully.');
  } catch (err) {
    console.warn('Failed to seed Firestore:', err);
  }
}
