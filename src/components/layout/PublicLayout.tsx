import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '../common/Footer';
import { Header } from '../common/Header';
import { MobileBottomNav } from '../common/MobileBottomNav';
import { Toast } from '../common/Toast';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-gray-900 selection:bg-[#FCE7F3] selection:text-[#831843]">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <Toast />
    </div>
  );
};
