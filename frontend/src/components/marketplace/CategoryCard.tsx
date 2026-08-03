'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface CategoryCardProps {
  title: string;
  image?: string;
  onClick?: () => void;
}

export function CategoryCard({
  title,
  image = 'https://images.unsplash.com/photo-1590614392211-13797c27ec8b?w=400&q=80',
  onClick,
}: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card 
        onClick={onClick}
        className="group relative aspect-square overflow-hidden rounded-3xl cursor-pointer border-0 shadow-sm"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-end p-6">
          <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
        </div>
      </Card>
    </motion.div>
  );
}
