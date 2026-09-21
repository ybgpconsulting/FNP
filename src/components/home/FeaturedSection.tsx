import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../products/ProductCard';

export const FeaturedSection: React.FC = () => {
  const { getFeaturedProducts } = useStore();
  const featuredProducts = getFeaturedProducts();

  if (featuredProducts.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 bg-white border-y border-[#F0EAE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#831843] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handcrafted Daily in Sector 76</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#29141B]">
              Featured Creations
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Our master chef&apos;s special bakes and artisan floral arrangements.
            </p>
          </div>

          <Link
            to="/shop?filter=featured"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#831843] hover:text-[#6b1336] transition-colors group self-start sm:self-auto"
          >
            <span>View All Featured</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Responsive Grid: 4 desktop, 3 tablet, 2 mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
