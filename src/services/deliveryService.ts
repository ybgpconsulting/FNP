import { doc, getDoc, setDoc } from 'firebase/firestore';
import { INITIAL_DELIVERY_SETTINGS } from '../data/initialData';
import { db, isFirebaseConfigured } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/firestoreService';
import { DeliverySettings, VerifiedLocation } from '../types';

const LS_DELIVERY_SETTINGS_KEY = 'fnp_noida76_delivery_settings_v1';
const SS_VERIFIED_LOCATION_KEY = 'fnp_noida76_verified_location_v1';

/**
 * Fetches the delivery settings from Firestore (settings/delivery).
 * Falls back to localStorage or INITIAL_DELIVERY_SETTINGS if offline/unconfigured.
 */
export async function fetchDeliverySettings(): Promise<DeliverySettings> {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'settings', 'delivery');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as DeliverySettings;
        localStorage.setItem(LS_DELIVERY_SETTINGS_KEY, JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn('Firestore fetchDeliverySettings warning, falling back:', err);
    }
  }

  const cached = localStorage.getItem(LS_DELIVERY_SETTINGS_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }

  return INITIAL_DELIVERY_SETTINGS;
}

/**
 * Saves updated delivery settings to Firestore (settings/delivery)
 * Requires authenticated admin permissions.
 */
export async function saveDeliverySettings(settings: DeliverySettings): Promise<void> {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'settings', 'delivery');
      await setDoc(docRef, settings);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/delivery');
    }
  }

  localStorage.setItem(LS_DELIVERY_SETTINGS_KEY, JSON.stringify(settings));
}

/**
 * Retrieves the currently verified location from sessionStorage.
 */
export function getStoredVerifiedLocation(): VerifiedLocation | null {
  try {
    const raw = sessionStorage.getItem(SS_VERIFIED_LOCATION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
      return parsed as VerifiedLocation;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Persists the verified location to sessionStorage.
 */
export function storeVerifiedLocation(location: VerifiedLocation): void {
  try {
    sessionStorage.setItem(SS_VERIFIED_LOCATION_KEY, JSON.stringify(location));
  } catch (err) {
    console.warn('Could not store verified location in sessionStorage', err);
  }
}

/**
 * Clears the verified location from sessionStorage.
 */
export function clearStoredVerifiedLocation(): void {
  try {
    sessionStorage.removeItem(SS_VERIFIED_LOCATION_KEY);
  } catch (err) {
    console.warn('Could not clear stored verified location', err);
  }
}
