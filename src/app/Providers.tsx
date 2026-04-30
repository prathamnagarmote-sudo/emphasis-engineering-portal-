'use client';

import { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatBot from '@/components/ui/ChatBot';
import AchievementPopup from '@/components/ui/AchievementPopup';
import ScrollToHashWrapper from '@/components/ScrollToHashWrapper';

import { CurrencyProvider } from '@/context/CurrencyContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CurrencyProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ChatBot />
          <ScrollToHashWrapper />
          <AchievementPopup />
        </CartProvider>
      </CurrencyProvider>
    </SessionProvider>
  );
}


