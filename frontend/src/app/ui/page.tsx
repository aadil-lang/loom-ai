import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSelector } from '@/components/ui/language-selector';
import { SearchBar } from '@/components/ui/search-bar';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { SupplierCard } from '@/components/marketplace/SupplierCard';
import { CategoryCard } from '@/components/marketplace/CategoryCard';
import { OrderStatusBadge, PriceBadge, StockBadge, MOQBadge } from '@/components/marketplace/Badges';
import { Rating } from '@/components/marketplace/Rating';

export default function UIShowcase() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl space-y-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">LoomAI Design System</h1>
          <p className="text-muted-foreground mt-2 text-lg">A premium, modern SaaS B2B marketplace UI component library.</p>
        </div>
        <div className="flex items-center gap-4">
          <SearchBar />
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>

      {/* Standard Components */}
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight border-l-4 border-primary pl-4">Standard Components</h2>
          <p className="text-muted-foreground mt-1">Reusable atoms built on top of shadcn/ui.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>Primary actions and variants.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>Status indicators.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* Marketplace Components */}
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight border-l-4 border-secondary pl-4">Marketplace Components</h2>
          <p className="text-muted-foreground mt-1">Specialized modules for the B2B textile workflow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Product Card</h3>
            <ProductCard 
              title="Premium Organic Cotton Fabric 200 GSM"
              supplier="Shree Textiles Ltd."
              price={145.50}
              moq={500}
              rating={4.8}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Supplier Card</h3>
            <SupplierCard 
              name="Global Weavers Inc."
              location="Surat, Gujarat"
              rating={4.9}
              type="manufacturer"
              verified
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Category Card</h3>
            <CategoryCard title="Sustainable Silk" />
          </div>
        </div>
      </section>

      {/* Domain Specific Badges */}
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight border-l-4 border-accent pl-4">Domain Badges & Ratings</h2>
        </div>
        
        <Card className="bg-muted/30">
          <CardContent className="flex flex-wrap gap-8 p-8">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Order Status</h4>
              <div className="flex flex-col gap-2">
                <OrderStatusBadge status="pending" />
                <OrderStatusBadge status="processing" />
                <OrderStatusBadge status="shipped" />
                <OrderStatusBadge status="delivered" />
                <OrderStatusBadge status="cancelled" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Inventory & Pricing</h4>
              <div className="flex flex-col gap-2 items-start">
                <StockBadge count={1200} />
                <StockBadge count={20} />
                <StockBadge count={0} />
                <MOQBadge amount={100} unit="m" />
                <PriceBadge price={250.00} />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Ratings</h4>
              <div className="flex flex-col gap-4">
                <Rating value={3.5} size="sm" />
                <Rating value={4.2} size="md" />
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Interactive:</span>
                  <Rating value={0} size="lg" readOnly={false} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* App States */}
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight border-l-4 border-muted-foreground pl-4">System States</h2>
          <p className="text-muted-foreground mt-1">Feedback UI for empty, error, and loading states.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <EmptyState />
          <ErrorState />
          <LoadingState text="Fetching latest inventory..." />
        </div>
      </section>

    </div>
  );
}
