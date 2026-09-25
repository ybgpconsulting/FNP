import React from 'react';
import { Clock, MapPin, Navigation, Phone, Store } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { safeExternalUrl } from '../../utils/urls';

export const StoreLocationSection: React.FC = () => {
  const { settings } = useStore();

  const cleanPhone = settings.phone.replace(/[^0-9+]/g, '') || '+919999517599';
  const cleanWhatsApp = settings.whatsappNumber.replace(/[^0-9]/g, '') || '919999517599';
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    'Hi, I would like to visit or order from Cakes N More at Shop 29, Amrapali Crystal Home, Sector 76 Noida.'
  )}`;

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-[#F0EAE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#FAF5F2] to-[#FFF9F6] rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#EADBDA] shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-12 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCE7F3] text-[#831843] text-xs font-bold uppercase tracking-wider">
                <Store className="w-3.5 h-3.5" />
                <span>Visit Our Neighborhood Store</span>
              </div>

              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#29141B] tracking-tight">
                  Cakes N More
                </h2>
                <p className="text-base sm:text-lg font-semibold text-[#831843] mt-1">
                  Sector 76, Noida • Uttar Pradesh
                </p>
              </div>

              {/* Address Box */}
              <div className="bg-white rounded-2xl p-5 border border-[#EADBDA] shadow-sm space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#831843] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Store Address</p>
                    <p className="text-sm font-medium text-gray-800 leading-relaxed mt-0.5">
                      {settings.address}
                    </p>
                    <p className="text-xs text-amber-800 bg-amber-50 rounded-md px-2 py-1 mt-2 inline-block font-medium">
                      📍 Landmark: Near Mithaas, Shopping Arcade, Amrapali Silicon City
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>Phone: {settings.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{settings.openingHours}</span>
                  </div>
                </div>
              </div>

              {/* Three Primary Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                {/* 1. Call Now */}
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#1C1618] hover:bg-black text-white font-bold text-sm shadow transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </a>

                {/* 2. Get Directions */}
                <a
                  href={safeExternalUrl(settings.mapsUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#831843] hover:bg-[#6b1336] text-white font-bold text-sm shadow transition-all active:scale-95"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>

                {/* 3. Order on WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow transition-all active:scale-95"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
