import fs from 'fs';
import path from 'path';
import { MarketplaceContainer } from '@/components/marketplace/MarketplaceContainer';
import { Button } from '@/components/ui/button';

export default async function MarketplacePage() {
  // Read JSON files synchronously for the Server Component
  const dataDir = path.join(process.cwd(), 'src', 'mocks');
  const products = JSON.parse(fs.readFileSync(path.join(dataDir, 'products.json'), 'utf8'));
  const categories = JSON.parse(fs.readFileSync(path.join(dataDir, 'categories.json'), 'utf8'));
  const suppliers = JSON.parse(fs.readFileSync(path.join(dataDir, 'suppliers.json'), 'utf8'));
  const colors = JSON.parse(fs.readFileSync(path.join(dataDir, 'colors.json'), 'utf8'));

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-indigo-600 text-white p-8 md:p-12 lg:p-16">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-md">
            ✨ Spring/Summer 2026 Collection
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Discover Premium Textiles Worldwide
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-xl">
            Source directly from verified top-tier mills. High-quality fabrics, competitive B2B pricing, and AI-powered matching.
          </p>
          <div className="flex gap-4 pt-4">
            <Button size="lg" variant="secondary" className="rounded-full px-8 font-bold">
              View Trends
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white font-bold">
              Request Samples
            </Button>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 right-48 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Main Interactive Marketplace Area */}
      <MarketplaceContainer 
        products={products}
        categories={categories}
        suppliers={suppliers}
        colors={colors}
      />
    </div>
  );
}
