import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartSidebar } from '../cart/CartSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
};