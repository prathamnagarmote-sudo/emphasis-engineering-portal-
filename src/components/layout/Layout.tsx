"use client";

import { FC, ReactNode } from 'react';
// This file is kept for reference but the layout is handled by app/layout.tsx
// All layout logic (Navbar, Footer, CartProvider) lives in the root layout.

const Layout: FC<{ children?: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default Layout;
