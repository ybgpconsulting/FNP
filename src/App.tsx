import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ScrollToTop } from './components/common/ScrollToTop';
import { DeliveryAvailabilityGate } from './components/delivery/DeliveryAvailabilityGate';
import { PublicLayout } from './components/layout/PublicLayout';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { DeliveryProvider } from './context/DeliveryContext';
import { StoreProvider } from './context/StoreContext';
import { AboutPage } from './pages/AboutPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminHomepagePage } from './pages/admin/AdminHomepagePage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { DeliverySettingsPage } from './pages/admin/DeliverySettingsPage';
import { CartPage } from './pages/CartPage';
import { CategoryPage } from './pages/CategoryPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { LegalPage } from './pages/LegalPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ShopPage } from './pages/ShopPage';

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <DeliveryProvider>
          <CartProvider>
            <AuthProvider>
              <ScrollToTop />
              <DeliveryAvailabilityGate />
              <Routes>
                {/* Public Storefront Routes */}
                <Route path="/" element={<PublicLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="shop" element={<ShopPage />} />
                  <Route path="category/:slug" element={<CategoryPage />} />
                  <Route path="product/:slug" element={<ProductDetailPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="privacy-policy" element={<LegalPage page="privacy" />} />
                  <Route path="terms-and-conditions" element={<LegalPage page="terms" />} />
                  <Route path="shipping-and-delivery" element={<LegalPage page="shipping" />} />
                  <Route path="returns-policy" element={<LegalPage page="returns" />} />
                </Route>

                {/* Admin Portal Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminLoginPage />} />
                <Route element={<AdminLayout />}>
                  <Route path="/admin/products" element={<AdminProductsPage />} />
                  <Route path="/admin/categories" element={<AdminCategoriesPage />} />
                  <Route path="/admin/homepage" element={<AdminHomepagePage />} />
                  <Route path="/admin/delivery" element={<DeliverySettingsPage />} />
                  <Route path="/admin/settings" element={<AdminSettingsPage />} />
                </Route>

                {/* Fallback 404 to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AuthProvider>
          </CartProvider>
        </DeliveryProvider>
      </StoreProvider>
    </BrowserRouter>
  );
}
