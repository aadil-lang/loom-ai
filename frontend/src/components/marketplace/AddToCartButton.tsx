'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';

interface AddToCartButtonProps {
  product: any; // Full product object
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    // Ensure product has .id mapped from ._id for CartContext consistency
    const cartProduct = { ...product, id: product.id || product._id };
    addToCart(cartProduct, product.moq || 100);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Button 
      size="lg" 
      className="flex-1 rounded-2xl h-14 text-base font-black shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all hover:-translate-y-1"
      onClick={handleAdd}
    >
      <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
    </Button>
  );
}
