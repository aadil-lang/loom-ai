import * as React from "react"
import { Building2, Star, ShieldCheck, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

/* eslint-disable @typescript-eslint/no-explicit-any */

interface SupplierSuggestionCardProps {
  supplier: any;
  isAiRecommendation?: boolean;
}

/**
 * AI-READY COMPONENT: SupplierSuggestionCard
 * 
 * Designed to present a supplier profile with trust signals.
 * The `isAiRecommendation` flag activates a special highlight state,
 * intended for when a LangGraph agent suggests this supplier as a perfect match.
 */
export function SupplierSuggestionCard({ supplier, isAiRecommendation = false }: SupplierSuggestionCardProps) {
  return (
    <div className={`p-6 rounded-xl border bg-white shadow-sm transition-all hover:shadow-md relative overflow-hidden ${isAiRecommendation ? 'border-blue-200 bg-blue-50/30' : ''}`}>
      {isAiRecommendation && (
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> AI Match
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border">
          <Building2 className="h-6 w-6 text-slate-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg leading-none flex items-center gap-2">
            {supplier.name}
            {supplier.certifications && supplier.certifications.length > 0 && (
              <ShieldCheck className="h-4 w-4 text-green-600" />
            )}
          </h3>
          <div className="text-sm text-muted-foreground mt-1 flex items-center gap-3">
            <span>{supplier.location || "Global"}</span>
            <span className="flex items-center text-amber-500 font-medium">
              <Star className="h-3 w-3 fill-current mr-1" /> {supplier.rating || "4.8"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-muted-foreground text-xs uppercase tracking-wider">Business Type</div>
          <div className="font-medium">{supplier.businessType || "Manufacturer"}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs uppercase tracking-wider">MOQ</div>
          <div className="font-medium">{supplier.moq || "Flexible"}</div>
        </div>
      </div>

      {supplier.certifications && supplier.certifications.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {supplier.certifications.slice(0, 3).map((cert: string) => (
            <span key={cert} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-semibold border">
              {cert}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <Link href={`/marketplace?supplier=${supplier.id}`} className="flex-1">
          <Button variant="outline" className="w-full">View Products</Button>
        </Link>
        <Button variant="ghost" size="icon">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
