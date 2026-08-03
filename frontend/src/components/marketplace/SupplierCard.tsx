'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, ShieldCheck, Factory } from 'lucide-react';
import { Rating } from './Rating';

interface SupplierCardProps {
  name: string;
  location: string;
  rating: number;
  type: 'mill' | 'dealer' | 'manufacturer';
  verified?: boolean;
  avatarUrl?: string;
}

export function SupplierCard({
  name,
  location,
  rating,
  type,
  verified = false,
  avatarUrl,
}: SupplierCardProps) {
  const typeLabels = {
    mill: 'Textile Mill',
    dealer: 'Fabric Dealer',
    manufacturer: 'Manufacturer',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card className="rounded-2xl border-border/50 bg-card hover:bg-muted/30 transition-colors cursor-pointer">
        <CardContent className="p-5 flex items-start gap-4">
          <Avatar className="h-14 w-14 rounded-xl border border-border">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-1.5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-base leading-none flex items-center gap-1.5">
                  {name}
                  {verified && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                </h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1.5">
                  <MapPin className="h-3 w-3" />
                  {location}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Rating value={rating} />
              <Badge variant="secondary" className="gap-1 rounded-md px-2 font-normal text-xs bg-secondary/40">
                <Factory className="h-3 w-3 text-secondary-foreground/70" />
                {typeLabels[type]}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
