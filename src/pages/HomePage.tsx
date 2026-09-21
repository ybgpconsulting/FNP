import React from 'react';
import { SEO } from '../components/common/SEO';
import { BestsellerSection } from '../components/home/BestsellerSection';
import { CategoryCards } from '../components/home/CategoryCards';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { Hero } from '../components/home/Hero';
import { OccasionSection } from '../components/home/OccasionSection';
import { StoreLocationSection } from '../components/home/StoreLocationSection';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { useStore } from '../context/StoreContext';

export const HomePage: React.FC = () => {
  const { settings, homepageConfig } = useStore();

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['Bakery', 'Florist', 'LocalBusiness'],
    name: settings.businessName || 'FNP - Florist & Bakery in Noida Sector 76',
    description: settings.metaDescription,
    telephone: settings.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shop No. 29, Ground Floor, Amrapali Crystal Home, Shopping Arcade, near Mithaas, Amrapali Silicon City',
      addressLocality: 'Sector 76, Noida',
      addressRegion: 'Uttar Pradesh',
      postalCode: '201301',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '28.5684',
      longitude: '77.3824',
    },
    url: 'https://fnp-noida76.web.app',
    openingHours: 'Mo-Su 09:00-23:00',
    priceRange: '₹₹',
  };

  return (
    <div>
      <SEO
        title={settings.websiteTitle || 'FNP Florist & Bakery in Sector 76 Noida | Cakes, Flowers & Gifts'}
        description={settings.metaDescription}
        schema={localBusinessSchema}
      />

      {/* 1. Hero */}
      <Hero />

      {/* 2. Category Cards */}
      <CategoryCards />

      {/* 3. Featured Products */}
      <FeaturedSection />

      {/* 4. Bestsellers */}
      <BestsellerSection />

      {/* 5. Shop by Occasion */}
      <OccasionSection />

      {/* 6. Why Choose Us */}
      <WhyChooseUs />

      {/* 7. Store Section (Sector 76 Location, Address, Map, WhatsApp, Call) */}
      <StoreLocationSection />
    </div>
  );
};
