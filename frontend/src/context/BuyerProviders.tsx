"use client"

import React from 'react';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';

export function BuyerProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
      </WishlistProvider>
    </CartProvider>
  );
}
