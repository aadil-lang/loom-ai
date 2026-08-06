/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, MessageSquare, Star, ArrowLeft, ShieldCheck, Factory, Box, 
  MapPin, Ruler, FileText, CheckCircle2, Package, Heart, Share2, MessageCircle, 
  Clock, Truck, Globe, Award
} from 'lucide-react';
import { Rating } from '@/components/marketplace/Rating';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { ProductReviews } from '@/components/marketplace/ProductReviews';
import { AddToCartButton } from '@/components/marketplace/AddToCartButton';
import { AIContextBanner } from '@/components/ai/AIContextBanner';
import { productService, supplierService } from '@/services';

// Unsplash Fabric Images Fallback
const FABRIC_IMAGES = [
  'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1590614392211-13797c27ec8b?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=1200&auto=format&fit=crop',
];

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const products = await productService.getProducts({ limit: 1000 });
  const categories = await productService.getCategories();
  const suppliers = await supplierService.getSuppliers();

  const product = await productService.getProductById(resolvedParams.id);
  if (!product) notFound();

  const category = categories.find((c: any) => (c.id || c._id) === product.categoryId);
  let supplier = suppliers.find((s: any) => (s.id || s._id) === product.supplierId);

  // Fallback Supplier Logic (Never display Unknown Supplier)
  if (!supplier) {
    supplier = {
      name: 'ABC Textiles Pvt Ltd',
      verified: true,
      businessType: 'Manufacturer',
      location: { city: 'Surat', state: 'Gujarat' },
      rating: 4.8,
      reviewCount: 156,
      businessAge: 12,
      exportCountries: 24,
      certifications: ['ISO 9001', 'GOTS']
    };
  }

  // Determine Image
  const displayImage = product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1200&auto=format&fit=crop';

  // Get similar products
  const similarProducts = products.filter((p: any) => p.categoryId === product.categoryId && (p.id || p._id) !== (product.id || product._id)).slice(0, 4);

  return (
    <div className="space-y-12 max-w-7xl mx-auto py-8">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
        <Link href="/marketplace" className="flex items-center hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Marketplace
        </Link>
        <span>/</span>
        <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer">{category?.name || 'Textile'}</span>
        <span>/</span>
        <span className="text-slate-900 dark:text-white truncate max-w-[300px]">{product.name}</span>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Top Section: Gallery & Buy Box */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Gallery (Left Col) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border group cursor-zoom-in relative shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={displayImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" />
            
            {product.inStock && (
              <Badge className="absolute top-4 left-4 bg-emerald-500 text-white font-bold border-none uppercase tracking-widest text-[10px] shadow-lg">
                Ready Stock
              </Badge>
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
            {[displayImage, ...FABRIC_IMAGES.filter(img => img !== displayImage).slice(0, 3)].map((img, i) => (
              <div key={i} className={`shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${i === 0 ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="thumbnail" className="w-full h-full object-cover hover:scale-110 transition-transform" />
              </div>
            ))}
          </div>
        </div>

        {/* Info & Buy Box (Middle Col) */}
        <div className="lg:col-span-7 flex flex-col space-y-8">
          
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">{product.name}</h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-full border">
                <Rating value={product.rating || 4.8} readOnly size="sm" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{product.rating || 4.8}</span>
                <span className="text-sm text-slate-400 font-medium">({product.reviewCount || 156} Reviews)</span>
              </div>
              <span className="text-sm text-slate-500 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {product.sku || `SKU-LM-${Math.floor(Math.random() * 10000)}`}
              </span>
            </div>
          </div>

          {/* Pricing & Commercial Box */}
          <div className="p-8 rounded-3xl bg-white dark:bg-card border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldCheck className="w-48 h-48" />
            </div>

            <div className="flex items-baseline gap-3 relative z-10">
              <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400">₹{product.pricePerMeter}</span>
              <span className="text-lg text-slate-500 font-bold uppercase tracking-widest">/ meter</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 relative z-10 border-y border-slate-100 dark:border-slate-800 py-6">
              <div className="space-y-1">
                <span className="flex items-center gap-2 text-sm text-slate-500 font-semibold"><Package className="w-4 h-4 text-slate-400" /> Minimum Order</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{product.moq} meters</p>
              </div>
              <div className="space-y-1">
                <span className="flex items-center gap-2 text-sm text-slate-500 font-semibold"><Clock className="w-4 h-4 text-slate-400" /> Lead Time</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{product.leadTimeDays || 7} Days</p>
              </div>
            </div>
            
            <div className="pt-2 flex flex-col sm:flex-row gap-4 relative z-10">
              <AddToCartButton product={product} />
              <Button size="lg" variant="outline" className="flex-1 rounded-2xl h-14 text-base font-black border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <MessageSquare className="w-5 h-5 mr-2" /> Contact Supplier
              </Button>
            </div>
            
            <div className="flex items-center justify-between pt-4 relative z-10 text-slate-500">
              <div className="flex items-center gap-6">
                <Button variant="ghost" size="sm" className="hover:text-rose-500 hover:bg-rose-50 font-bold"><Heart className="w-4 h-4 mr-2" /> Wishlist</Button>
                <Button variant="ghost" size="sm" className="hover:text-blue-500 hover:bg-blue-50 font-bold"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4" /> Trade Assurance
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Middle Section: Specs, Supplier, Reviews */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
        
        {/* Left Col: Tabs (Specs, Reviews) */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-14 bg-transparent p-0 space-x-8">
              <TabsTrigger value="specifications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base font-bold text-slate-500 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white">Product Specifications</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base font-bold text-slate-500 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white">Buyer Reviews</TabsTrigger>
              <TabsTrigger value="shipping" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base font-bold text-slate-500 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white">Shipping & Packaging</TabsTrigger>
            </TabsList>
            
            <TabsContent value="specifications" className="pt-8 space-y-8">
              
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                  {product.longDescription || product.description || `Premium quality ${product.name} sourced directly from ${supplier.name}. This fabric is engineered for high durability, excellent color fastness, and is suitable for a wide range of industrial and fashion applications.`}
                </p>
              </div>

              <div className="bg-white dark:bg-card border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                  <tbody>
                    <tr className="border-b bg-slate-50/50 dark:bg-slate-900/50">
                      <th className="px-6 py-4 font-bold text-slate-500 w-1/3 flex items-center gap-2"><Box className="w-4 h-4"/> Material</th>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{product.material || product.composition || '100% Cotton'}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-6 py-4 font-bold text-slate-500 flex items-center gap-2"><Ruler className="w-4 h-4"/> Weight (GSM)</th>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{product.gsm || product.weightGSM || '120'} GSM</td>
                    </tr>
                    <tr className="border-b bg-slate-50/50 dark:bg-slate-900/50">
                      <th className="px-6 py-4 font-bold text-slate-500 flex items-center gap-2"><Ruler className="w-4 h-4"/> Width</th>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{product.width || product.widthCM || '58'} Inches</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-6 py-4 font-bold text-slate-500 flex items-center gap-2"><FileText className="w-4 h-4"/> Pattern</th>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{product.pattern || 'Solid'}</td>
                    </tr>
                    <tr className="border-b bg-slate-50/50 dark:bg-slate-900/50">
                      <th className="px-6 py-4 font-bold text-slate-500 flex items-center gap-2"><Box className="w-4 h-4"/> Weave Type</th>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{product.weave || 'Plain'}</td>
                    </tr>
                    <tr>
                      <th className="px-6 py-4 font-bold text-slate-500 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> End Use</th>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">Apparel, Home Textiles, Industrial</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">Certifications & Quality</h3>
                <div className="flex flex-wrap gap-3">
                  {(product.certifications || ['ISO 9001:2015', 'OEKO-TEX Standard 100', 'GOTS']).map((cert: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border px-4 py-3 rounded-xl">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-8">
              <ProductReviews productId={product.id || product._id} />
            </TabsContent>
            
            <TabsContent value="shipping" className="pt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border space-y-3">
                  <Truck className="w-8 h-8 text-blue-500" />
                  <h4 className="font-bold text-lg">Logistics Partners</h4>
                  <p className="text-slate-500 text-sm">Dispatched via BlueDart, FedEx, or standard transport based on volume.</p>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border space-y-3">
                  <Package className="w-8 h-8 text-amber-500" />
                  <h4 className="font-bold text-lg">Packaging</h4>
                  <p className="text-slate-500 text-sm">Rolled on hard paper tubes, wrapped in thick plastic film to prevent moisture.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Col: Supplier Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-card border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl sticky top-24">
            
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex flex-col items-center justify-center font-black text-2xl shrink-0 shadow-inner">
                {supplier.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-black text-lg leading-tight hover:text-emerald-600 cursor-pointer transition-colors">{supplier.name}</h3>
                <div className="flex items-center gap-1.5 mt-2">
                  <Rating value={supplier.rating || 4.8} readOnly size="sm" />
                  <span className="text-xs font-bold text-slate-500">({supplier.reviewCount || 120})</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <MapPin className="w-5 h-5 text-slate-400" /> 
                {supplier.location?.city || 'Surat'}, {supplier.location?.state || 'Gujarat'}
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Factory className="w-5 h-5 text-slate-400" /> 
                {supplier.businessType || 'Manufacturer & Exporter'}
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Globe className="w-5 h-5 text-slate-400" /> 
                Exporting to {supplier.exportCountries || 24} Countries
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> 
                <span className="text-emerald-600 dark:text-emerald-400">Verified Supplier • {supplier.businessAge || 15} Yrs</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-center border">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Response Rate</p>
                <p className="font-black text-lg">98.4%</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-center border">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">On-Time Delivery</p>
                <p className="font-black text-lg">96.2%</p>
              </div>
            </div>

            <Button className="w-full h-12 rounded-xl text-base font-bold mb-3 shadow-md">
              View Supplier Profile
            </Button>
            <Button variant="outline" className="w-full h-12 rounded-xl text-base font-bold border-2">
              Send Message
            </Button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Bottom Section: Related Products */}
      {/* ---------------------------------------------------- */}
      {similarProducts.length > 0 && (
        <div className="pt-16 pb-24 border-t mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight">Similar Fabrics</h2>
            <Button variant="link" className="font-bold text-emerald-600">View All</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p: any) => (
              <ProductCard
                key={p.id || p._id}
                id={p.id || p._id}
                title={p.name}
                supplier={supplier.name} // Inherit supplier mock data for related products
                price={p.pricePerMeter}
                moq={p.moq}
                image={p.images && p.images.length > 0 ? p.images[0] : ''}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
