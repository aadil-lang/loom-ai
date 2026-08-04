"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface WishlistContextType {
  savedProductIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('loomai_wishlist');
    if (saved) {
      try {
        setSavedProductIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('loomai_wishlist', JSON.stringify(savedProductIds));
  }, [savedProductIds]);

  const toggleWishlist = (productId: string) => {
    setSavedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => savedProductIds.includes(productId);

  return (
    <WishlistContext.Provider value={{ savedProductIds, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
