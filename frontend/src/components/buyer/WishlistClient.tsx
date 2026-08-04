"use client"

import * as React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';
import { HeartCrack } from 'lucide-react';
import { ProductCard } from '@/components/marketplace/ProductCard';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function WishlistClient({ initialProducts }: { initialProducts: any[] }) {
  const { savedProductIds } = useWishlist();
  
  // Filter on client based on local storage state
  const savedProducts = initialProducts.filter(p => savedProductIds.includes(p.id));

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto p-4 md:p-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Wishlist</h1>
        <p className="text-muted-foreground mt-1">Products you've saved for later consideration.</p>
      </div>

      {savedProducts.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-xl bg-slate-50">
          <HeartCrack className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No items saved</h2>
          <p className="text-muted-foreground mb-6">Explore the marketplace and click the heart icon to save products here.</p>
          <Link href="/marketplace">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
              Explore Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {savedProducts.map(product => (
            <div key={product.id} className="relative group">
              <ProductCard 
                id={product.id}
                title={product.name}
                supplier={product.supplier}
                price={product.pricePerMeter}
                moq={product.moq}
                rating={product.rating || 4.5}
                image={product.images?.[0]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
