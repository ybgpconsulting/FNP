import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../products/ProductCard';

export const BestsellerSection: React.FC = () => {
  const { getBestsellerProducts } = useStore();
  const bestsellerProducts = getBestsellerProducts();

  if (bestsellerProducts.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B45309] uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 fill-[#B45309]" />
              <span>Customer Favorites in Sector 76</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#29141B]">
              Bestsellers of the Week
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Most loved cakes, red roses, and celebration hampers ordered this week.
            </p>
          </div>

          <Link
            to="/shop?filter=bestseller"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#831843] hover:text-[#6b1336] transition-colors group self-start sm:self-auto"
          >
            <span>Explore All Bestsellers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestsellerProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
