import React from 'react';
import { Cake, Gift, MapPin, MessageCircle, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const ICON_MAP: Record<string, React.ReactNode> = {
  Cake: <Cake className="w-6 h-6 text-[#831843]" />,
  Gift: <Gift className="w-6 h-6 text-[#831843]" />,
  MapPin: <MapPin className="w-6 h-6 text-[#831843]" />,
  MessageCircle: <MessageCircle className="w-6 h-6 text-[#25D366]" />,
  Truck: <Truck className="w-6 h-6 text-[#831843]" />,
};

export const WhyChooseUs: React.FC = () => {
  const { homepageConfig } = useStore();

  const points = homepageConfig.whyUsPoints || [];

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCE7F3] text-[#831843] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The FNP Promise</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#29141B]">
            Why Sector 76 Chooses Us
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Committed to freshness, exquisite presentation, and seamless neighborhood service.
          </p>
        </div>

        {/* 5 Points Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {points.map((pt, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-[#ECE2DC] shadow-sm hover:shadow-md transition-shadow flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FAF5F2] flex items-center justify-center mb-4 border border-[#F0E6E1]">
                {ICON_MAP[pt.icon] || <ShieldCheck className="w-6 h-6 text-[#831843]" />}
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-1.5 leading-snug">
                {pt.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {pt.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
