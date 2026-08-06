'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, MapPin, Factory, ShieldCheck, Clock, Eye, Heart } from 'lucide-react';
import { PriceBadge, MOQBadge } from './Badges';
import { Rating } from './Rating';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  id?: string;
  title: string;
  supplier: string;
  supplierLocation?: string;
  supplierType?: string;
  price: number;
  moq: number;
  leadTimeDays?: number;
  rating?: number;
  reviewCount?: number;
  image?: string;
  material?: string;
  gsm?: number;
  width?: string | number;
  badges?: string[];
  isVerified?: boolean;
  onAddToCart?: () => void;
}

export const ProductCard = React.memo(function ProductCard({
  id,
  title,
  supplier,
  supplierLocation = 'Surat, Gujarat',
  supplierType = 'Manufacturer',
  price,
  moq,
  leadTimeDays = 7,
  rating = 4.8,
  reviewCount = 124,
  image,
  material = 'Cotton',
  gsm,
  width,
  badges = [],
  isVerified = true,
  onAddToCart,
}: ProductCardProps) {
  const { addToCart } = useCart();
  
  const displayImage = image || 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=800&auto=format&fit=crop';

  const content = (
    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={displayImage}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-110"
      />
      
      {/* Top Left Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
        {isVerified && (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none font-bold text-[10px] uppercase tracking-wider py-0.5 px-2 shadow-md">
            Verified
          </Badge>
        )}
        {badges.slice(0, 2).map((badge, idx) => (
          <Badge key={idx} variant="secondary" className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-none font-semibold text-[10px] text-slate-800 dark:text-slate-200 py-0.5 px-2 shadow-sm">
            {badge}
          </Badge>
        ))}
      </div>

      {/* Quick Actions Overlay on Hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20">
        <Button size="icon" variant="secondary" className="rounded-full shadow-lg h-10 w-10 hover:bg-white hover:text-emerald-600 transition-colors relative z-20">
          <Eye className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" className="rounded-full shadow-lg h-10 w-10 hover:bg-white hover:text-rose-500 transition-colors relative z-20">
          <Heart className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const titleContent = (
    <h3 className="font-extrabold text-base lg:text-lg line-clamp-2 leading-tight flex-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-slate-900 dark:text-white">
      {id ? (
        <Link href={`/product/${id}`} className="after:absolute after:inset-0 focus:outline-none">
          {title}
        </Link>
      ) : title}
    </h3>
  );

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="h-full"
    >
      <Card className="overflow-hidden rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-900/50 h-full flex flex-col group/card bg-white dark:bg-card relative">
        {content}
        
        <CardHeader className="p-4 pb-0 space-y-2">
          <div className="flex justify-between items-start gap-3 relative">
            {titleContent}
          </div>
          
          {/* Price & MOQ Row */}
          <div className="flex items-end justify-between pt-1">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">₹{price}</span>
              <span className="text-xs text-slate-500 font-medium">/ m</span>
            </div>
            <MOQBadge amount={moq} />
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-3 flex-1 flex flex-col justify-start">
          
          {/* Product Specs Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 px-2 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Material</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">{material}</span>
            </div>
            {(gsm || width) && (
              <div className="bg-slate-50 dark:bg-slate-900/50 px-2 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Specs</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">
                  {gsm ? `${gsm} GSM ` : ''}{width ? `• ${width}"` : ''}
                </span>
              </div>
            )}
          </div>

          <hr className="border-slate-100 dark:border-slate-800 mb-3" />

          {/* Supplier Info Block */}
          <div className="space-y-2 flex-1">
            <Link href="#" className="group/sup block relative z-20">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover/sup:text-emerald-600 transition-colors flex items-center gap-1.5">
                {isVerified && <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />}
                {supplier === 'Unknown Supplier' ? 'ABC Textiles Pvt Ltd' : supplier}
              </h4>
            </Link>
            
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
              <div className="flex items-center text-xs text-slate-500 font-medium">
                <Rating value={rating} readOnly size="sm" className="mr-1" />
                <span>({reviewCount})</span>
              </div>
              <div className="flex items-center text-xs text-slate-500 font-medium">
                <MapPin className="h-3 w-3 mr-1 text-slate-400" />
                <span className="line-clamp-1 max-w-[100px]">{supplierLocation}</span>
              </div>
              <div className="flex items-center text-xs text-slate-500 font-medium">
                <Factory className="h-3 w-3 mr-1 text-slate-400" />
                <span>{supplierType}</span>
              </div>
              {leadTimeDays && (
                <div className="flex items-center text-xs text-slate-500 font-medium">
                  <Clock className="h-3 w-3 mr-1 text-slate-400" />
                  <span>{leadTimeDays}d lead</span>
                </div>
              )}
            </div>
          </div>

        </CardContent>
        
        <CardFooter className="p-4 pt-0 gap-2 relative z-20">
          <Button 
            variant="outline" 
            className="flex-1 rounded-xl font-bold text-xs shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700"
          >
            Contact
          </Button>
          <Button 
            className="flex-1 rounded-xl gap-2 font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-md dark:bg-emerald-600 dark:hover:bg-emerald-700"
            onClick={(e) => {
              e.preventDefault();
              if (onAddToCart) {
                onAddToCart();
              } else {
                addToCart({ id, name: title, pricePerMeter: price, moq, images: [displayImage] }, moq || 100);
                toast.success(`${title} added to cart`);
              }
            }}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
});
