import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { OCCASIONS } from '../../data/initialData';

export const OccasionSection: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-white border-b border-[#F0EAE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold text-[#831843] uppercase tracking-widest">
            Special Moments
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#29141B] mt-2">
            Shop by Occasion
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Find the perfect surprise designed specifically for your memorable milestones.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {OCCASIONS.map((occ) => (
            <Link
              key={occ.slug}
              to={`/category/${occ.categorySlug}`}
              className="group relative rounded-2xl overflow-hidden shadow-md aspect-[3/4] flex flex-col justify-end p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Background Image */}
              <img
                src={occ.image}
                alt={occ.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Text content */}
              <div className="relative z-10 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#FCE7F3] block">
                  Celebration
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide group-hover:text-[#FCE7F3] transition-colors">
                  {occ.name}
                </h3>
                <p className="text-[11px] text-gray-300 line-clamp-1 mt-0.5">
                  {occ.description}
                </p>
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#FCE7F3] group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
