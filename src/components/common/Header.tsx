import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Clock,
  Heart,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShoppingBag,
  Store,
  X,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

export const Header: React.FC = () => {
  const { totalQuantity } = useCart();
  const { settings, categories, homepageConfig } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchModal(false);
      setSearchQuery('');
    }
  };

  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '') || '919999517599';
  const directWhatsAppUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
    'Hi FNP Florist & Bakery Sector 76, I would like to inquire about products and same-day delivery.'
  )}`;

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EADDD7]/60 shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all">
      {/* Top Announcement Bar */}
      {homepageConfig.promoBannerActive && (
        <div className="bg-[#581c2f] text-[#FDE8EF] text-xs font-medium py-1.5 px-4 text-center tracking-wide overflow-hidden flex items-center justify-center gap-4">
          <span className="truncate">{settings.bannerAnnouncement || homepageConfig.promoBannerText}</span>
          <span className="hidden md:inline-flex items-center gap-1 text-[#FBCFE8] hover:underline cursor-pointer">
            <Phone className="w-3 h-3" /> {settings.phone}
          </span>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Local Identity */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#831843] to-[#9D174D] flex items-center justify-center text-white shadow-sm ring-2 ring-[#FCE7F3] group-hover:scale-105 transition-transform">
              <Store className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#4A1525] group-hover:text-[#831843] transition-colors leading-none">
                FNP
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[#78350F] font-medium font-sans mt-0.5">
                Florist & Bakery
              </span>
              <span className="text-[10px] text-gray-500 font-normal">
                Sector 76, Noida
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'text-[#831843] bg-[#FCE7F3]/60 font-semibold'
                  : 'text-gray-700 hover:text-[#831843] hover:bg-white/60'
              }`}
            >
              Home
            </Link>

            <Link
              to="/shop"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/shop')
                  ? 'text-[#831843] bg-[#FCE7F3]/60 font-semibold'
                  : 'text-gray-700 hover:text-[#831843] hover:bg-white/60'
              }`}
            >
              Shop All
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#831843] rounded-lg hover:bg-white/60 transition-colors"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                Categories
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#831843]" />
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                    Our Specialties
                  </div>
                  {categories
                    .filter((c) => c.active)
                    .map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${category.slug}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FDF2F8] hover:text-[#831843] transition-colors"
                        onClick={() => setCategoriesOpen(false)}
                      >
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-100"
                        />
                        <span className="font-medium">{category.name}</span>
                      </Link>
                    ))}
                </div>
              )}
            </div>

            <Link
              to="/about"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/about')
                  ? 'text-[#831843] bg-[#FCE7F3]/60 font-semibold'
                  : 'text-gray-700 hover:text-[#831843] hover:bg-white/60'
              }`}
            >
              About
            </Link>

            <Link
              to="/contact"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/contact')
                  ? 'text-[#831843] bg-[#FCE7F3]/60 font-semibold'
                  : 'text-gray-700 hover:text-[#831843] hover:bg-white/60'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Header Actions: Search, Cart, WhatsApp CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              onClick={() => setShowSearchModal(true)}
              aria-label="Search cakes and flowers"
              className="p-2.5 text-gray-600 hover:text-[#831843] hover:bg-white rounded-full transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <Link
              to="/cart"
              aria-label={`Shopping cart with ${totalQuantity} items`}
              className="relative p-2.5 text-gray-700 hover:text-[#831843] hover:bg-white rounded-full transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalQuantity > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-[#831843] text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-scale-up">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {/* Desktop WhatsApp CTA Button */}
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium text-sm shadow-sm hover:shadow transition-all group"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Order on WhatsApp</span>
            </a>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-[#831843] lg:hidden rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bottom-0 bg-white/98 z-50 overflow-y-auto border-t border-gray-100 p-6 flex flex-col justify-between animate-in slide-in-from-top duration-200">
          <div className="space-y-4">
            {/* Mobile Search input */}
            <form onSubmit={handleSearch} className="relative mb-6">
              <input
                type="text"
                placeholder="Search cakes, roses, bouquets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#831843]"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </form>

            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className="px-4 py-3 rounded-xl text-base font-medium text-gray-800 hover:bg-[#FDF2F8] hover:text-[#831843]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="px-4 py-3 rounded-xl text-base font-medium text-gray-800 hover:bg-[#FDF2F8] hover:text-[#831843]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop All Products
              </Link>

              <div className="pt-2 pb-1">
                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 text-sm text-gray-700 font-medium hover:bg-[#FDF2F8] hover:text-[#831843]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <img src={cat.image} alt={cat.name} className="w-7 h-7 rounded-full object-cover" />
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/about"
                className="px-4 py-3 rounded-xl text-base font-medium text-gray-800 hover:bg-[#FDF2F8] hover:text-[#831843]"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Store
              </Link>
              <Link
                to="/contact"
                className="px-4 py-3 rounded-xl text-base font-medium text-gray-800 hover:bg-[#FDF2F8] hover:text-[#831843]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact & Directions
              </Link>
            </nav>
          </div>

          <div className="pt-6 border-t border-gray-100 space-y-3">
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] text-white font-medium text-base shadow"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Chat with us on WhatsApp</span>
            </a>

            <div className="text-center text-xs text-gray-500">
              <p className="font-medium text-gray-700">{settings.address}</p>
              <p className="mt-1">📞 {settings.phone}</p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-serif text-lg font-bold text-gray-900">Search Products</h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type cake flavour, flower type, or gift item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#831843]"
                />
                <Search className="w-6 h-6 text-gray-400 absolute left-4 top-3.5" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="text-gray-400 self-center">Popular:</span>
                {['Truffle Cake', 'Red Roses', 'Oreo Cake', 'Birthday Hamper', 'Lilies'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      navigate(`/shop?search=${encodeURIComponent(term)}`);
                      setShowSearchModal(false);
                    }}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-[#FDF2F8] hover:text-[#831843] rounded-full text-gray-600 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="mt-5 w-full py-3 bg-[#831843] hover:bg-[#6b1336] text-white font-medium rounded-xl text-sm transition-colors"
              >
                Search Catalogue
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
