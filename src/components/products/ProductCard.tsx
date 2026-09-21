import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { settings } = useStore();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultWeight = product.weightOptions?.[0];
    addToCart(product, 1, defaultWeight);
  };

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop';

  const secondaryImage =
    product.images && product.images.length > 1 ? product.images[1] : primaryImage;

  return (
    <>
      <div
        className="premium-card group relative bg-white rounded-2xl overflow-hidden border border-[#EBE3DE] hover:border-[#D1B8B3] flex flex-col h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container with Consistent 1:1 Aspect Ratio */}
        <Link to={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-[#FAF8F5]">
          <img
            src={isHovered && secondaryImage !== primaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Badges: Discount, Bestseller, Featured */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {discountPercent > 0 && (
              <span className="bg-[#831843] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
            {product.bestseller && (
              <span className="bg-[#B45309] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                Bestseller
              </span>
            )}
            {product.featured && !product.bestseller && (
              <span className="bg-[#047857] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                Featured
              </span>
            )}
            {(product.categoryId === 'cat-cakes' || product.categorySlug === 'cakes') && (
              <span className="bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
                100% Eggless
              </span>
            )}
          </div>

          {/* Availability overlay if out of stock */}
          {!product.available && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-20">
              <span className="bg-white text-gray-900 font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow">
                Currently Unavailable
              </span>
            </div>
          )}

          {/* Quick View Floating Action */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuickViewOpen(true);
            }}
            aria-label={`Quick view ${product.name}`}
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/95 text-gray-700 hover:text-[#831843] hover:bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
          >
            <Eye className="w-4 h-4" />
          </button>
        </Link>

        {/* Product Details Content */}
        <div className="p-4 flex flex-col flex-grow justify-between">
          <div>
            {product.categoryName && (
              <span className="text-[11px] font-semibold text-[#831843] uppercase tracking-wider block mb-1">
                {product.categoryName}
              </span>
            )}

            <Link
              to={`/product/${product.slug}`}
              className="font-serif text-base sm:text-lg font-bold text-gray-900 hover:text-[#831843] line-clamp-1 transition-colors"
            >
              {product.name}
            </Link>

            <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price & Action Row */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-gray-900">
                ₹{product.price}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.oldPrice}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.available}
              aria-label={`Add ${product.name} to cart`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                product.available
                  ? 'bg-[#FDF2F8] hover:bg-[#831843] text-[#831843] hover:text-white active:scale-95'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <QuickViewModal product={product} onClose={() => setQuickViewOpen(false)} />
      )}
    </>
  );
};
