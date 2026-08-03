'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { PriceBadge, MOQBadge } from './Badges';
import { Rating } from './Rating';

interface ProductCardProps {
  title: string;
  supplier: string;
  price: number;
  moq: number;
  rating: number;
  image?: string;
  onAddToCart?: () => void;
}

export function ProductCard({
  title,
  supplier,
  price,
  moq,
  rating,
  image = 'https://images.unsplash.com/photo-1590614392211-13797c27ec8b?w=400&q=80',
  onAddToCart,
}: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card className="overflow-hidden rounded-2xl border-border/40 shadow-sm transition-shadow hover:shadow-md h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        
        <CardHeader className="p-4 pb-2 space-y-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-base line-clamp-2 leading-tight flex-1">{title}</h3>
            <PriceBadge price={price} />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">{supplier}</p>
        </CardHeader>
        
        <CardContent className="p-4 pt-0 flex-1 flex flex-col justify-end">
          <div className="flex items-center justify-between mt-4">
            <Rating value={rating} />
            <MOQBadge amount={moq} />
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            variant="outline" 
            className="w-full rounded-xl gap-2 hover:bg-primary hover:text-primary-foreground border-primary/20"
            onClick={onAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
