"use client"

import * as React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();

  const shipping = items.length > 0 ? 150 : 0;
  const total = cartTotal + shipping;

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto p-4 md:p-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
        <p className="text-muted-foreground mt-1">Review your items before proceeding to checkout.</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-xl bg-slate-50">
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added any fabrics yet.</p>
          <Link href="/marketplace">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
              Browse Marketplace
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 p-4 rounded-xl border bg-white shadow-sm">
                <div className="h-24 w-24 bg-slate-100 rounded-md overflow-hidden shrink-0">
                  <img src={product.images?.[0] || "https://placehold.co/200"} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">Supplier: {product.supplier}</p>
                    </div>
                    <div className="font-bold text-lg">${(product.pricePerMeter * quantity).toLocaleString()}</div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">Qty (m):</span>
                      <div className="flex items-center border rounded-md">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => updateQuantity(product.id, quantity - 100)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <div className="w-12 text-center text-sm font-medium">{quantity}</div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => updateQuantity(product.id, quantity + 100)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeFromCart(product.id)}>
                      <Trash2 className="h-4 w-4 mr-2" /> Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-6">
            <div className="p-6 rounded-xl border bg-white shadow-sm space-y-4">
              <h3 className="font-bold text-lg border-b pb-4">Order Summary</h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Shipping</span>
                <span className="font-medium">${shipping.toLocaleString()}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <Link href="/checkout" className="block mt-6">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg h-12">
                  Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <Link href="/marketplace" className="block text-center">
              <Button variant="link" className="text-muted-foreground">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
