"use client"

import React from 'react';
import { WishlistProvider } from './WishlistContext';

export function BuyerProviders({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      {children}
    </WishlistProvider>
  );
}
