import React from 'react';
import { MapPin, Check, AlertCircle } from 'lucide-react';
import { useDeliveryAvailability } from '../../context/DeliveryContext';
import { formatDistanceKm } from '../../utils/distance';

interface DeliveryLocationBadgeProps {
  className?: string;
  compact?: boolean;
}

export const DeliveryLocationBadge: React.FC<DeliveryLocationBadgeProps> = ({
  className = '',
  compact = false,
}) => {
  const { verifiedLocation, openDeliveryGate } = useDeliveryAvailability();

  if (!verifiedLocation) {
    return (
      <button
        type="button"
        onClick={openDeliveryGate}
        aria-label="Check delivery availability"
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FDF2F8] text-[#831843] border border-[#FCE7F3] hover:bg-[#FCE7F3] active:scale-95 transition-all ${className}`}
      >
        <MapPin className="w-3.5 h-3.5 text-[#831843] shrink-0" />
        <span>Check Delivery</span>
      </button>
    );
  }

  const isEligible = verifiedLocation.verified;
  const distText = formatDistanceKm(verifiedLocation.distanceKm);

  return (
    <button
      type="button"
      onClick={openDeliveryGate}
      title="Click to change your delivery location"
      aria-label={`Delivery location: ${distText}. Click to change.`}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm active:scale-95 transition-all cursor-pointer ${
        isEligible
          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
          : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
      } ${className}`}
    >
      <MapPin className={`w-3.5 h-3.5 shrink-0 ${isEligible ? 'text-emerald-600' : 'text-amber-600'}`} />
      <span>{compact ? distText : `Delivery: ${distText}`}</span>
      {isEligible ? (
        <Check className="w-3 h-3 text-emerald-600" />
      ) : (
        <AlertCircle className="w-3 h-3 text-amber-600" />
      )}
    </button>
  );
};
