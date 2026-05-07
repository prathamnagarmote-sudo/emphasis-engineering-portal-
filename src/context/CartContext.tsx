"use client";

import { FC, ReactNode, createContext, useCallback, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  type: 'course' | 'service' | 'test';
  thumbnail?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  totalItems: number;
  totalPrice: number;
  purchasedItems: string[];
  purchaseItem: (id: string, voucherCode?: string) => Promise<void>;
  isPurchased: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const { data: session, update } = useSession();

  // Load purchased items from session
  useEffect(() => {
    if (session?.user && (session.user as any).purchasedContent) {
      setPurchasedItems((session.user as any).purchasedContent);
    } else if (!session) {
      setPurchasedItems([]);
    }
  }, [session]);

  const addToCart = useCallback((item: CartItem) => {
    setItems(prev => {
      if (prev.some(i => i.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback((id: string) => {
    return items.some(item => item.id === id);
  }, [items]);

  const purchaseItem = useCallback(async (id: string, voucherCode?: string) => {
    if (!session) {
      window.location.href = `/login?callbackUrl=${window.location.pathname}`;
      return;
    }

    try {
      const res = await fetch("/api/user/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId: id, voucherCode })
      });
      if (res.ok) {
        const data = await res.json();
        setPurchasedItems(data.purchasedContent);
        removeFromCart(id);
        await update(); // Force session refresh
      } else {
        alert("Purchase failed. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Purchase failed due to network error.");
    }
  }, [removeFromCart, session, update]);

  const isPurchased = useCallback((id: string) => {
    if (session?.user && (session.user as any).role === "admin") return true;
    return purchasedItems.includes(id);
  }, [purchasedItems, session]);

  const totalItems = items.length;
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        totalItems,
        totalPrice,
        purchasedItems,
        purchaseItem,
        isPurchased
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
