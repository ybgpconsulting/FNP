import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, ShoppingBag, Store } from 'lucide-react';
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

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 py-1.5 px-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center w-16 py-1 text-[11px] font-medium transition-colors ${
            isActive('/') && location.pathname === '/' ? 'text-[#831843]' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </Link>

        {/* Shop */}
        <Link
          to="/shop"
          className={`flex flex-col items-center justify-center w-16 py-1 text-[11px] font-medium transition-colors ${
            isActive('/shop') ? 'text-[#831843]' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Store className="w-5 h-5 mb-0.5" />
          <span>Shop</span>
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className={`relative flex flex-col items-center justify-center w-16 py-1 text-[11px] font-medium transition-colors ${
            isActive('/cart') ? 'text-[#831843]' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#831843] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </div>
          <span>Cart</span>
        </Link>

        {/* WhatsApp Fast Order */}
        <a
          href={directWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#25D366] text-white text-xs font-semibold shadow-sm active:scale-95 transition-transform"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>WhatsApp</span>
        </a>
      </div>
    </nav>
  );
};
