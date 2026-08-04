import * as React from 'react';
import { supplierService, buyerService } from '@/services';
import { SupplierSuggestionCard } from '@/components/buyer/SupplierSuggestionCard';
import { Bookmark } from 'lucide-react';

export default async function SuppliersPage() {
  const [savedSuppliers, allSuppliers] = await Promise.all([
    buyerService.getSavedSuppliers(),
    supplierService.getSuppliers()
  ]);

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto p-4 md:p-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Saved Suppliers</h1>
        <p className="text-muted-foreground mt-1">Manage your trusted manufacturing partners.</p>
      </div>

      {savedSuppliers.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-blue-600" />
            Your Favorites
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedSuppliers.map((sup: any) => (
              <SupplierSuggestionCard key={sup.id} supplier={sup} />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4 pt-8">
        <h2 className="text-xl font-bold">Recommended Partners</h2>
        <p className="text-sm text-muted-foreground">AI-driven suggestions based on your sourcing history and quality requirements.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allSuppliers.slice(3, 6).map((sup: any, idx: number) => (
            <SupplierSuggestionCard key={sup.id} supplier={sup} isAiRecommendation={idx === 0} />
          ))}
        </div>
      </section>
    </div>
  );
}
