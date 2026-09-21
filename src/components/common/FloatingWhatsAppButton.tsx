import React from 'react';
import { useStore } from '../../context/StoreContext';
import { WhatsAppIcon } from './WhatsAppIcon';

const PREFILLED_MESSAGE = 'Hi! I visited your website and would like to place an order.';

export const FloatingWhatsAppButton: React.FC = () => {
  const { settings } = useStore();
  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '') || '919999517599';
  const whatsappUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(PREFILLED_MESSAGE)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Place an order on WhatsApp"
      title="Place an order on WhatsApp"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-900/20 transition-transform hover:scale-105 hover:bg-[#20bd5a] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 active:scale-95"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
};