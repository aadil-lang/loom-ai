import * as React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Factory, MapPin, ShieldCheck } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

export function SupplierGrid() {
  return (
    <section className="py-24 bg-[#FAFAFA] dark:bg-background border-t border-b">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Premium Verified Suppliers</h2>
            <p className="text-lg text-muted-foreground mt-2">Partner with India's most reliable and highest-rated manufacturing units.</p>
          </div>
          <Link prefetch={false} href="/suppliers" className="hidden md:flex items-center text-primary font-bold hover:underline text-lg">
            View All Suppliers <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 rounded-3xl hover:shadow-xl transition-shadow border-muted bg-white dark:bg-card relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -z-10 group-hover:bg-emerald-500/20 transition-colors"></div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border shadow-sm">
                  <Factory className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <h3 className="font-bold text-xl group-hover:text-primary transition-colors">Arvind Mills Ltd.</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4 text-emerald-500" /> Ahmedabad, Gujarat
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Export Quality
                  </Badge>
                  <Badge variant="outline">ISO 9001</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Business Since</p>
                    <p className="font-semibold">1931</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Response Rate</p>
                    <p className="font-semibold text-emerald-600">98% (&lt; 2h)</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Specialization:</p>
                  <p className="text-sm font-semibold truncate">Denim, Woven Shirting, Khadi</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
