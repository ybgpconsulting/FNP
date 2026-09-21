import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  ExternalLink,
  Facebook,
  Heart,
  Instagram,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Store,
  Twitter,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, categories } = useStore();
  const currentYear = new Date().getFullYear();

  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '') || '919999517599';
  const whatsappUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
    'Hi, I would like to inquire about products at FNP Florist & Bakery, Sector 76 Noida.'
  )}`;

  return (
    <footer className="bg-[#1C1618] text-[#D8C7C5] pt-16 pb-24 sm:pb-16 border-t border-[#312527]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand & Overview (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#9D174D] text-white flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-white tracking-tight leading-none">
                  FNP Florist & Bakery
                </h3>
                <p className="text-xs text-[#E8A598] tracking-wider uppercase font-medium mt-1">
                  Sector 76, Noida • Uttar Pradesh
                </p>
              </div>
            </div>

            <p className="text-sm text-[#A89897] leading-relaxed max-w-sm pt-1">
              Your premier neighborhood destination for freshly baked artisanal celebration cakes,
              handcrafted fresh flower bouquets, indoor air-purifying plants, and luxury gift hampers.
              Crafted fresh daily with doorstep delivery across Noida.
            </p>

            <div className="pt-2 flex items-center gap-3">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                  className="w-9 h-9 rounded-full bg-[#2A1E22] hover:bg-[#9D174D] text-white flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Facebook"
                  className="w-9 h-9 rounded-full bg-[#2A1E22] hover:bg-[#9D174D] text-white flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Twitter/X"
                  className="w-9 h-9 rounded-full bg-[#2A1E22] hover:bg-[#9D174D] text-white flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
              </a>
            </div>
          </div>

          {/* Quick Links (Col 3) */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#E8A598] font-bold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Our Store
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact & Map
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Review Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories (Col 4) */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#E8A598] font-bold">Catalogue</h4>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`} className="hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details (Col 5) */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#E8A598] font-bold">Store Visit</h4>
            <div className="space-y-2.5 text-xs text-[#B5A5A4]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E8A598] shrink-0 mt-0.5" />
                <p className="leading-snug">{settings.address}</p>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E8A598] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white font-medium">
                  {settings.phone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-[#25D366] font-medium"
                >
                  WhatsApp: {settings.whatsappNumber}
                </a>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#E8A598] shrink-0 mt-0.5" />
                <span>{settings.openingHours}</span>
              </div>

              <div className="pt-1">
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#FBCFE8] hover:underline"
                >
                  <span>Get Google Maps Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 mt-8 border-t border-[#312527] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A797A] gap-4">
          <p>© {currentYear} FNP Florist &amp; Bakery. All rights reserved. Sector 76, Noida, UP 201301.</p>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">•</span>
            <span>Easy WhatsApp Ordering</span>
            <span className="text-gray-600">•</span>
            <Link to="/admin" className="hover:text-white inline-flex items-center gap-1 transition-colors">
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
