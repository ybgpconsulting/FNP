import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ScrollToTop } from './components/common/ScrollToTop';
import { PublicLayout } from './components/layout/PublicLayout';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { StoreProvider } from './context/StoreContext';
import { AboutPage } from './pages/AboutPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminHomepagePage } from './pages/admin/AdminHomepagePage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { CartPage } from './pages/CartPage';
import { CategoryPage } from './pages/CategoryPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ShopPage } from './pages/ShopPage';

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <CartProvider>
          <AuthProvider>
            <ScrollToTop />
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
              </Route>

              {/* Admin Portal Routes */}
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/products" replace />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="homepage" element={<AdminHomepagePage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="*" element={<Navigate to="/admin/products" replace />} />
              </Route>

              {/* Fallback 404 to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </CartProvider>
      </StoreProvider>
    </BrowserRouter>
  );
}
