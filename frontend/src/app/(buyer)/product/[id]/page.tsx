/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, MessageSquare, Star, ArrowLeft, ShieldCheck, Factory, Box, MapPin, Ruler, FileText, CheckCircle2, Package, Heart, Share2, MessageCircle } from 'lucide-react';
import { Rating } from '@/components/marketplace/Rating';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { productService, supplierService } from '@/services';

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const products = await productService.getProducts();
  const categories = await productService.getCategories();
  const suppliers = await supplierService.getSuppliers();
  const colors = await productService.getColors();

  const product = products.find((p: any) => p.id === params.id);
  if (!product) notFound();

  const category = categories.find((c: any) => c.id === product.categoryId);
  const supplier = suppliers.find((s: any) => s.id === product.supplierId);
  const productColors = colors.filter((c: any) => product.availableColors.includes(c.id));

  // Get similar products in the same category
  const similarProducts = products.filter((p: any) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-muted border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 cursor-pointer ${i === 1 ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.images[0]} alt="thumbnail" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              <span>{category?.name || 'Textile'}</span>
              <span>•</span>
              <span className={product.inStock ? "text-emerald-600" : "text-destructive"}>{product.inStock ? "In Stock" : "Out of Stock"}</span>
              <span className="ml-auto text-xs">SKU: {product.sku}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <Rating value={product.rating} readOnly size="md" />
              <span className="text-sm text-muted-foreground underline decoration-dashed underline-offset-4 cursor-pointer hover:text-foreground">
                {product.reviewCount} Reviews
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-muted/30 border space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">${product.pricePerMeter}</span>
              <span className="text-muted-foreground font-medium">/ meter</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Package className="w-4 h-4" /> MOQ: {product.moq} meters</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Trade Assurance</span>
            </div>
            
            <div className="pt-4 flex gap-4">
              <Button size="lg" className="flex-1 rounded-full text-base font-bold shadow-sm">
                <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
              </Button>
              <Button size="lg" variant="secondary" className="rounded-full font-bold shadow-sm">
                <MessageCircle className="w-5 h-5 mr-2" /> Ask AI
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 pt-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground"><Heart className="w-4 h-4 mr-2" /> Save</Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
            </div>
          </div>

          {/* Supplier Mini-Card */}
          <div className="flex items-center p-4 border rounded-2xl gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
              {supplier?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base line-clamp-1">{supplier?.name}</h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {supplier?.location}</span>
                <span className="flex items-center gap-1"><Factory className="w-3 h-3" /> Est. {supplier?.established}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-full shrink-0">View Profile</Button>
          </div>
        </div>
      </div>

      {/* Details Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t pt-12">
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Product Description</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{product.description}</p>
          </section>
          
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Available Colors</h2>
            <div className="flex flex-wrap gap-4">
              {productColors.map((color: any) => (
                <div key={color.id} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full shadow-sm border border-black/10" style={{ backgroundColor: color.hex }} />
                  <span className="text-xs font-medium text-muted-foreground">{color.name}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Key Features</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.features.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Specifications</h2>
          <div className="p-6 rounded-3xl bg-muted/30 border space-y-4">
            <SpecRow icon={FileText} label="Composition" value={product.composition} />
            <SpecRow icon={Ruler} label="Weight (GSM)" value={`${product.gsm} gsm`} />
            <SpecRow icon={Ruler} label="Width" value={product.width} />
            <SpecRow icon={MapPin} label="Origin" value={product.countryOfOrigin} />
            <SpecRow icon={ShieldCheck} label="Certifications" value={product.certifications.join(', ')} />
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="border-t pt-12 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Similar Products</h2>
            <Button variant="ghost">View All</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p: any) => (
              <ProductCard
                key={p.id}
                id={p.id}
                title={p.name}
                supplier={suppliers.find((s:any) => s.id === p.supplierId)?.name || 'Supplier'}
                price={p.pricePerMeter}
                moq={p.moq}
                rating={p.rating}
                image={p.images[0]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SpecRow({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0 border-border/50">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Icon className="w-4 h-4 opacity-70" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground text-right">{value}</span>
    </div>
  );
}
