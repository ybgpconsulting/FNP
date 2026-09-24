import { INITIAL_DELIVERY_SETTINGS } from '../data/initialData';
import { fetchDeliverySettings as fetchCloudDeliverySettings, saveDeliverySettings as saveCloudDeliverySettings } from './storeApi';
import { DeliverySettings, VerifiedLocation } from '../types';

const LS_DELIVERY_SETTINGS_KEY = 'fnp_noida76_delivery_settings_v1';
const SS_VERIFIED_LOCATION_KEY = 'fnp_noida76_verified_location_v1';

/**
 * Fetches delivery settings from the Cloudflare API.
 * Falls back to localStorage or INITIAL_DELIVERY_SETTINGS if offline/unconfigured.
 */
export async function fetchDeliverySettings(): Promise<DeliverySettings> {
  try { return await fetchCloudDeliverySettings(); } catch (err) { console.warn('Cloudflare fetchDeliverySettings warning, falling back:', err); }

  const cached = localStorage.getItem(LS_DELIVERY_SETTINGS_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as DeliverySettings;
      if (
        typeof parsed.enabled === 'boolean' &&
        typeof parsed.radiusKm === 'number' &&
        typeof parsed.storeLatitude === 'number' &&
        typeof parsed.storeLongitude === 'number'
      ) {
        return parsed;
      }
    } catch {
      // ignore
    }
  }

  return INITIAL_DELIVERY_SETTINGS;
}

/**
 * Saves updated delivery settings through the Cloudflare API.
 * Requires authenticated admin permissions.
 */
export async function saveDeliverySettings(settings: DeliverySettings): Promise<void> {
  await saveCloudDeliverySettings(settings);
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
