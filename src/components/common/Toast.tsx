import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const Toast: React.FC = () => {
  const { toastMessage, hideToast } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-8 right-4 sm:right-8 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="bg-[#1C1618] text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 max-w-sm">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        <span className="text-sm font-medium leading-snug">{toastMessage}</span>
        <div className="flex items-center gap-2 ml-auto shrink-0 pl-2">
          <Link
            to="/cart"
            onClick={hideToast}
            className="text-xs bg-[#831843] hover:bg-[#9D174D] text-white font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>View Cart</span>
          </Link>
          <button
            onClick={hideToast}
            className="text-gray-400 hover:text-white p-1 rounded-md"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
