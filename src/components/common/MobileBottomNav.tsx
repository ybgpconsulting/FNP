import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Grid, Home, MessageCircle, Phone, ShoppingBag, Store } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

export const MobileBottomNav: React.FC = () => {
  const { totalQuantity } = useCart();
  const { settings } = useStore();
  const location = useLocation();

  // Hide on admin routes so admin panel has pure dashboard layout
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '') || '919999517599';
  const directWhatsAppUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
    'Hi, I would like to order fresh cakes/flowers from FNP Florist & Bakery, Sector 76 Noida.'
  )}`;

  const cleanPhone = settings.phone ? settings.phone.replace(/[^0-9+]/g, '') : '+919999517599';

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 bg-white/98 backdrop-blur-lg border-t border-[#EADBDA] z-40 px-2 pt-1.5 pb-[max(0.4rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center min-w-[54px] py-1 text-[10px] font-semibold transition-all active:scale-95 ${
            isActive('/') && location.pathname === '/'
              ? 'text-[#831843]'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </Link>

        {/* Shop All */}
        <Link
          to="/shop"
          className={`flex flex-col items-center justify-center min-w-[54px] py-1 text-[10px] font-semibold transition-all active:scale-95 ${
            isActive('/shop') ? 'text-[#831843]' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Store className="w-5 h-5 mb-0.5" />
          <span>Shop</span>
        </Link>

        {/* 1-Tap Quick Call Store */}
        <a
          href={`tel:${cleanPhone}`}
          className="flex flex-col items-center justify-center min-w-[54px] py-1 text-[10px] font-semibold text-gray-500 hover:text-[#831843] transition-all active:scale-95"
          aria-label="Call Store"
        >
          <Phone className="w-5 h-5 mb-0.5 text-[#831843]" />
          <span>Call</span>
        </a>

        {/* Cart */}
        <Link
          to="/cart"
          className={`relative flex flex-col items-center justify-center min-w-[54px] py-1 text-[10px] font-semibold transition-all active:scale-95 ${
            isActive('/cart') ? 'text-[#831843]' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#831843] text-white text-[9px] font-extrabold min-w-4 h-4 px-1 rounded-full flex items-center justify-center ring-2 ring-white">
                {totalQuantity}
              </span>
            )}
          </div>
          <span>Cart</span>
        </Link>

        {/* Direct WhatsApp Instant Order Button */}
        <a
          href={directWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#25D366] text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>WhatsApp</span>
        </a>
      </div>
    </nav>
  );
};
