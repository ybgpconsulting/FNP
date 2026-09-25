import React, { useState } from 'react';
import {
  Truck,
  Save,
  CheckCircle2,
  Navigation,
  Map,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { LocationPicker } from '../../components/delivery/LocationPicker';
import { useDeliveryAvailability } from '../../context/DeliveryContext';
import { DeliverySettings } from '../../types';

export const DeliverySettingsPage: React.FC = () => {
  const { deliverySettings, updateSettings } = useDeliveryAvailability();

  const [formData, setFormData] = useState<DeliverySettings>({ ...deliverySettings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  // Sync state if initial settings loaded later
  React.useEffect(() => {
    setFormData({ ...deliverySettings });
  }, [deliverySettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      await updateSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      console.error('Failed to save delivery settings', err);
      setSaveError(err.message || 'Failed to update delivery settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        setFormData((prev) => ({
          ...prev,
          storeLatitude: Number(pos.coords.latitude.toFixed(6)),
          storeLongitude: Number(pos.coords.longitude.toFixed(6)),
        }));
      },
      (err) => {
        setGpsLoading(false);
        alert(`Could not fetch location: ${err.message}`);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleMapConfirm = (lat: number, lon: number) => {
    setFormData((prev) => ({
      ...prev,
      storeLatitude: Number(lat.toFixed(6)),
      storeLongitude: Number(lon.toFixed(6)),
    }));
    setShowMapModal(false);
  };

  return (
    <div className="space-y-6">
      <SEO title="Delivery Settings | Cakes N More Admin" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EADBDA] shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#FDF2F8] text-[#831843] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Delivery Radius &amp; Store Location
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure the delivery availability gate, store GPS coordinates, and delivery radius (default 10 km).
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#831843] hover:bg-[#6b1336] text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Delivery Settings</span>
            </>
          )}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Delivery settings updated successfully and applied to the live storefront!</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{saveError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status & Radius */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBDA] shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF2F8] text-[#831843] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900">Delivery Availability Status</h2>
              <p className="text-xs text-gray-500">Enable or disable delivery checks and set the service radius.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Delivery Enabled Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 bg-gray-50">
              <div>
                <label className="text-sm font-bold text-gray-900 block">Delivery System Status</label>
                <span className="text-xs text-gray-500">
                  {formData.enabled ? 'Delivery checking active' : 'Delivery temporarily suspended'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) => setFormData((prev) => ({ ...prev, enabled: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#831843]"></div>
              </label>
            </div>

            {/* Delivery Radius */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Delivery Radius (KM)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={50}
                  step={0.5}
                  value={formData.radiusKm}
                  onChange={(e) => setFormData((prev) => ({ ...prev, radiusKm: Number(e.target.value) || 10 }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#831843]"
                  required
                />
                <span className="px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm">
                  KM
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Customers further than this distance from store coordinates will be classified as outside delivery area.
              </p>
            </div>
          </div>
        </div>

        {/* Store GPS Coordinates */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBDA] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 flex-wrap gap-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900">Cakes N More Store GPS Coordinates</h2>
              <p className="text-xs text-gray-500">
                The 10 km radius is calculated strictly from these exact store coordinates.
              </p>
            </div>

            {/* Action buttons to set location */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={gpsLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#EADBDA] text-xs font-bold text-[#831843] hover:bg-[#FDF2F8] active:scale-95 transition-all"
              >
                {gpsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                <span>Use Current Location</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMapModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#831843] text-white text-xs font-bold hover:bg-[#6b1336] active:scale-95 transition-all shadow-sm"
              >
                <Map className="w-3.5 h-3.5" />
                <span>Choose on Map</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Store Name / Identifier
              </label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData((prev) => ({ ...prev, storeName: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#831843]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Store Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.storeLatitude}
                onChange={(e) => setFormData((prev) => ({ ...prev, storeLatitude: Number(e.target.value) }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#831843]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Store Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.storeLongitude}
                onChange={(e) => setFormData((prev) => ({ ...prev, storeLongitude: Number(e.target.value) }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#831843]"
                required
              />
            </div>
          </div>

          {/* Customer Facing Message */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Customer-Facing Delivery Message
            </label>
            <textarea
              rows={2}
              value={formData.deliveryMessage}
              onChange={(e) => setFormData((prev) => ({ ...prev, deliveryMessage: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#831843]"
              required
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Displayed on the first-screen delivery availability modal to all visiting customers.
            </p>
          </div>
        </div>

        {/* Future / Advanced Delivery Parameters */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBDA] shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-gray-900">
            Optional Policy &amp; Pincode Filters
          </h2>
          <p className="text-xs text-gray-500">
            Prepared fields for future delivery fee rules and postal code screening.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Min Order Value (₹)
              </label>
              <input
                type="number"
                min={0}
                value={formData.minOrderValue || 0}
                onChange={(e) => setFormData((prev) => ({ ...prev, minOrderValue: Number(e.target.value) || 0 }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#831843]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Standard Delivery Charge (₹)
              </label>
              <input
                type="number"
                min={0}
                value={formData.deliveryCharge || 0}
                onChange={(e) => setFormData((prev) => ({ ...prev, deliveryCharge: Number(e.target.value) || 0 }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#831843]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Free Delivery Threshold (₹)
              </label>
              <input
                type="number"
                min={0}
                value={formData.freeDeliveryThreshold || 0}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, freeDeliveryThreshold: Number(e.target.value) || 0 }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#831843]"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Allowed Pincodes (Comma separated)
            </label>
            <input
              type="text"
              value={formData.allowedPincodes?.join(', ') || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  allowedPincodes: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="201301, 201304, 201305, 201306, 201307, 201308"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#831843]"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#831843] hover:bg-[#6b1336] text-white font-bold text-sm shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving Delivery Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Map Picker Modal for Admin to pick Store Location */}
      {showMapModal && (
        <div role="dialog" aria-modal="true" aria-labelledby="store-location-modal-title" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-gray-200">
            <h2 id="store-location-modal-title" className="sr-only">Select Cakes N More Store Location</h2>
            <LocationPicker
              title="Select Cakes N More Store Location"
              storeLat={formData.storeLatitude}
              storeLon={formData.storeLongitude}
              radiusKm={formData.radiusKm}
              deliveryEnabled={formData.enabled}
              initialLat={formData.storeLatitude}
              initialLon={formData.storeLongitude}
              onConfirmLocation={handleMapConfirm}
              onCancel={() => setShowMapModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
