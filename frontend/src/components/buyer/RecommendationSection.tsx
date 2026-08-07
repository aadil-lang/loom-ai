"use client"

import * as React from "react"
import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

/* eslint-disable @typescript-eslint/no-explicit-any */

interface RecommendationSectionProps {
  products: any[];
  title?: string;
  subtitle?: string;
}

/**
 * AI-READY COMPONENT: RecommendationSection
 * 
 * Currently consumes mock deterministic products. 
 * Designed to seamlessly swap to a LangGraph/LLM agent data source later.
 */
export function RecommendationSection({ 
  products, 
  title = "Recommended for You",
  subtitle = "Based on your preferred categories and sourcing history."
}: RecommendationSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            {title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <Link href="/marketplace">
          <Button variant="ghost" size="sm" className="hidden sm:flex text-blue-600">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => {
          const productId = product._id || product.id;
          const productName = product.name || product.slug?.replace(/-/g, ' ') || 'Fabric';
          const rawImg = product.images || product.primaryImage || '';
          const imageUrl = Array.isArray(rawImg) ? (rawImg[0] || '') : rawImg;
          const backendBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace('/api/v1', '');
          const resolvedImg = imageUrl.startsWith('http') ? imageUrl : imageUrl ? `${backendBase}${imageUrl}` : 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=400&auto=format&fit=crop';
          return (
          <Link key={productId} href={`/product/${productId}`}>
            <div className="group cursor-pointer rounded-xl border bg-white overflow-hidden hover:shadow-md transition-all">
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                <img 
                  src={resolvedImg}
                  alt={productName} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="text-sm font-semibold truncate">{productName}</div>
                <div className="text-xs text-muted-foreground mt-1">{product.supplier || product.supplierName || 'Verified Supplier'}</div>
                <div className="font-bold text-blue-600 mt-2">₹{product.pricePerMeter}/m</div>
              </div>
            </div>
          </Link>
          );
        })}
        {products.length === 0 && (
          <div className="col-span-full py-8 text-center text-muted-foreground border border-dashed rounded-xl">
            No recommendations available at this time.
          </div>
        )}
      </div>
    </section>
  )
}
