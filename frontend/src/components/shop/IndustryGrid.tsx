import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const INDUSTRIES = [
  { name: 'Fashion Apparel', fabrics: 'Cotton, Silk, Denim', img: 'https://images.unsplash.com/photo-1537832816519-689ad163238b?w=600&q=80' },
  { name: 'Home Furnishings', fabrics: 'Linen, Canvas, Velvet', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80' },
  { name: 'Hospitality', fabrics: 'Polyester, Cotton Blends', img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80' },
  { name: 'Healthcare', fabrics: 'Non-Woven, Technical', img: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80' },
];

export function IndustryGrid() {
  return (
    <section className="py-24 bg-[#FAFAFA] dark:bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Sourcing by Industry</h2>
          <p className="text-lg text-muted-foreground">Tailored textile collections curated for specialized manufacturing sectors.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INDUSTRIES.map((industry) => (
            <Link prefetch={false} key={industry.name} href={`/marketplace?industry=${encodeURIComponent(industry.name)}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-all group border-0 bg-white dark:bg-card">
                <div className="relative h-48 w-full bg-muted overflow-hidden">
                  <Image src={industry.img} alt={industry.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">{industry.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">Popular: {industry.fabrics}</p>
                  <span className="text-sm font-semibold text-primary flex items-center group-hover:underline">
                    View Collection <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
