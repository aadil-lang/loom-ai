import * as React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { productService } from '@/services';
import Link from 'next/link';
import { Layers, ArrowRight } from 'lucide-react';

export default async function CategoriesPage() {
  const categories = await productService.getCategories();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 rounded-3xl border border-primary/10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Fabric Categories</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
          Browse our extensive collection of premium textiles. From breathable natural fibers to technical performance fabrics, find exactly what your procurement program needs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((cat: Record<string, unknown> & { id?: string, _id?: string, name?: string, description?: string }) => (
          <Link href={`/marketplace?category=${cat.id}`} key={cat.id || cat._id} className="group">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-border/50 group-hover:border-primary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
              <CardHeader className="p-6 pb-2">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl group-hover:text-primary transition-colors">{cat.name}</h3>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cat.description || `Explore our high-quality selection of ${cat.name}.`}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
