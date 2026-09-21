import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { INITIAL_DELIVERY_SETTINGS } from '../data/initialData';
import {
  clearStoredVerifiedLocation,
  fetchDeliverySettings,
  getStoredVerifiedLocation,
  saveDeliverySettings,
  storeVerifiedLocation,
} from '../services/deliveryService';
import { DeliverySettings, DeliveryStatus, VerifiedLocation } from '../types';
import { calculateDistanceKm, isWithinDeliveryRadius } from '../utils/distance';

interface DeliveryContextType {
  deliverySettings: DeliverySettings;
  settingsLoading: boolean;
  deliveryStatus: DeliveryStatus;
  verifiedLocation: VerifiedLocation | null;
  deliveryGateOpen: boolean;
  openDeliveryGate: () => void;
  closeDeliveryGate: () => void;
  verifyCoordinates: (
    lat: number,
    lon: number,
    source: 'gps' | 'map' | 'manual',
    addressText?: string,
    pincode?: string
  ) => { isAvailable: boolean; distanceKm: number };
  clearDeliveryVerification: () => void;
  updateSettings: (newSettings: DeliverySettings) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

// Detect search engine bots to avoid obstructing indexation
function isSearchEngineCrawler(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = (navigator.userAgent || '').toLowerCase();
  return (
    ua.includes('googlebot') ||
    ua.includes('bingbot') ||
    ua.includes('yandex') ||
    ua.includes('baiduspider') ||
    ua.includes('duckduckbot') ||
    ua.includes('slurp') ||
    ua.includes('facebot') ||
    ua.includes('twitterbot') ||
    ua.includes('lighthouse')
  );
}

export const DeliveryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const routerLocation = useLocation();
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>(INITIAL_DELIVERY_SETTINGS);
  const [settingsLoading, setSettingsLoading] = useState<boolean>(true);
  const [verifiedLocation, setVerifiedLocationState] = useState<VerifiedLocation | null>(() =>
    getStoredVerifiedLocation()
  );
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>(() => {
    const stored = getStoredVerifiedLocation();
    if (!stored) return 'unknown';
    return stored.verified ? 'available' : 'unavailable';
  });

  // Determine whether gate should be open initially
  const [deliveryGateOpen, setDeliveryGateOpen] = useState<boolean>(() => {
    // Never block bots
    if (isSearchEngineCrawler()) return false;
    // Don't show gate if already verified
    const stored = getStoredVerifiedLocation();
    if (stored && stored.verified) return false;
    // If on admin path, don't open
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return false;
    }
    return true;
  });

  const loadSettings = async () => {
    try {
      setSettingsLoading(true);
      const settings = await fetchDeliverySettings();
      setDeliverySettings(settings);

      // If we have a stored verified location, re-check distance against potentially updated store coords/radius
      const stored = getStoredVerifiedLocation();
      if (stored) {
        const dist = calculateDistanceKm(
          stored.latitude,
          stored.longitude,
          settings.storeLatitude,
          settings.storeLongitude
        );
        const eligible = isWithinDeliveryRadius(dist, settings.radiusKm);
        const updated: VerifiedLocation = {
          ...stored,
          distanceKm: dist,
          verified: eligible,
        };
        setVerifiedLocationState(updated);
        setDeliveryStatus(eligible ? 'available' : 'unavailable');
        storeVerifiedLocation(updated);
      }
    } catch (err) {
      console.warn('Error loading delivery settings:', err);
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Suppress gate on admin pages
  useEffect(() => {
    if (routerLocation.pathname.startsWith('/admin')) {
      setDeliveryGateOpen(false);
    }
  }, [routerLocation.pathname]);

  const openDeliveryGate = () => setDeliveryGateOpen(true);
  const closeDeliveryGate = () => setDeliveryGateOpen(false);

  const verifyCoordinates = (
    lat: number,
    lon: number,
    source: 'gps' | 'map' | 'manual',
    addressText?: string,
    pincode?: string
  ): { isAvailable: boolean; distanceKm: number } => {
    const dist = calculateDistanceKm(
      lat,
      lon,
      deliverySettings.storeLatitude,
      deliverySettings.storeLongitude
    );

    const isAvailable = deliverySettings.enabled && isWithinDeliveryRadius(dist, deliverySettings.radiusKm);

    const newVerification: VerifiedLocation = {
      verified: isAvailable,
      latitude: lat,
      longitude: lon,
      distanceKm: dist,
      source,
      addressText: addressText || (source === 'gps' ? 'Current GPS Location' : 'Selected on Map'),
      pincode,
      checkedAt: Date.now(),
    };

    setVerifiedLocationState(newVerification);
    setDeliveryStatus(isAvailable ? 'available' : 'unavailable');
    storeVerifiedLocation(newVerification);

    return { isAvailable, distanceKm: dist };
  };

  const clearDeliveryVerification = () => {
    clearStoredVerifiedLocation();
    setVerifiedLocationState(null);
    setDeliveryStatus('unknown');
    setDeliveryGateOpen(true);
  };

  const updateSettings = async (newSettings: DeliverySettings) => {
    await saveDeliverySettings(newSettings);
    setDeliverySettings(newSettings);
    // Re-verify if location exists
    if (verifiedLocation) {
      const dist = calculateDistanceKm(
        verifiedLocation.latitude,
        verifiedLocation.longitude,
        newSettings.storeLatitude,
        newSettings.storeLongitude
      );
      const isAvailable = newSettings.enabled && isWithinDeliveryRadius(dist, newSettings.radiusKm);
      const updated: VerifiedLocation = {
        ...verifiedLocation,
        distanceKm: dist,
        verified: isAvailable,
      };
      setVerifiedLocationState(updated);
      setDeliveryStatus(isAvailable ? 'available' : 'unavailable');
      storeVerifiedLocation(updated);
    }
  };

  return (
    <DeliveryContext.Provider
      value={{
        deliverySettings,
        settingsLoading,
        deliveryStatus,
        verifiedLocation,
        deliveryGateOpen,
        openDeliveryGate,
        closeDeliveryGate,
        verifyCoordinates,
        clearDeliveryVerification,
        updateSettings,
        refreshSettings: loadSettings,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDeliveryAvailability = (): DeliveryContextType => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDeliveryAvailability must be used within a DeliveryProvider');
  }
  return context;
};
