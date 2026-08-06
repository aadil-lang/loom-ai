'use client';

import * as React from 'react';
import { ProductCard } from './ProductCard';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Slider } from '../ui/slider';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search, Mic, MicOff } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '../ui/sheet';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';

const REGION_HIERARCHY = [
  { state: "Gujarat", cities: ["Surat", "Ahmedabad", "Rajkot"], hubs: ["Ring Road", "Narol", "Jetpur"] },
  { state: "Tamil Nadu", cities: ["Tiruppur", "Erode", "Karur"], hubs: ["PN Road", "Bhavani", "Vengamedu"] },
  { state: "Maharashtra", cities: ["Mumbai", "Bhiwandi", "Ichalkaranji"], hubs: ["Kalbadevi", "Kalyan Road", "DKTE"] },
  { state: "Rajasthan", cities: ["Bhilwara", "Jaipur", "Pali"], hubs: ["Pur Road", "Sanganer", "Mandia Road"] },
  { state: "Punjab", cities: ["Ludhiana", "Amritsar"], hubs: ["Bahadur Ke Road", "Focal Point"] },
  { state: "Uttar Pradesh", cities: ["Varanasi", "Kanpur", "Noida"], hubs: ["Bhelupur", "Jajmau", "Sector 63"] }
];

const CERTIFICATIONS = ["GOTS", "OEKO-TEX Standard 100", "ISO 9001", "REACH", "Fair Trade"];
const MATERIALS = ["Cotton", "Polyester", "Silk", "Linen", "Wool", "Viscose", "Blend"];
const BUSINESS_TYPES = ["Manufacturer", "Exporter", "Wholesaler", "Distributor"];

interface MarketplaceContainerProps {
  products: any[];
  categories: any[];
  suppliers: any[];
  colors: any[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MarketplaceContainer({ products, categories, suppliers, colors }: MarketplaceContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  // Search input state (local first, then applied)
  const [localSearch, setLocalSearch] = React.useState(searchParams.get('q') || '');
  
  // Inline search states for long filter lists
  const [citySearch, setCitySearch] = React.useState('');

  const { isListening, supported, toggleListening } = useSpeechRecognition((transcript) => {
    setLocalSearch(prev => prev + (prev ? ' ' : '') + transcript);
    // Auto trigger search after voice ends
    setSingleParam('q', localSearch + (localSearch ? ' ' : '') + transcript);
  });

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);

  // Parse filters from URL
  const activeCategories = searchParams.getAll('category');
  const activeMaterials = searchParams.getAll('material');
  const activeStates = searchParams.getAll('state');
  const activeCities = searchParams.getAll('city');
  const activeSupplierTypes = searchParams.getAll('businessType');
  const activeSupplierIds = searchParams.getAll('supplier');
  const activeCertifications = searchParams.getAll('cert');
  const activeColors = searchParams.getAll('color');
  
  const minPrice = parseInt(searchParams.get('minPrice') || '0');
  const maxPrice = parseInt(searchParams.get('maxPrice') || '5000');
  const maxMoq = parseInt(searchParams.get('maxMoq') || '10000');
  const searchString = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort') || 'newest';

  const isVerifiedOnly = searchParams.get('verified') === 'true';

  // Listen for the old `?hub=` parameter to migrate it to state/city automatically for backward compatibility with the new homepage cards.
  const urlHub = searchParams.get('hub');
  React.useEffect(() => {
    if (urlHub) {
      // Find which city or state it corresponds to, and set it properly.
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.delete('hub'); // Remove the old hub param
      
      let matched = false;
      for (const r of REGION_HIERARCHY) {
        if (r.state.toLowerCase() === urlHub.toLowerCase()) {
          current.append('state', r.state);
          matched = true;
          break;
        }
        for (const city of r.cities) {
          if (city.toLowerCase() === urlHub.toLowerCase()) {
            current.append('city', city);
            matched = true;
            break;
          }
        }
      }
      
      if (matched) {
        router.push(`${pathname}?${current.toString()}`, { scroll: false });
      }
    }
  }, [urlHub, searchParams, pathname, router]);

  // Helper to toggle array URL param
  const toggleArrayParam = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const existing = current.getAll(key);
    current.delete(key);
    
    if (existing.includes(value)) {
      existing.filter(e => e !== value).forEach(v => current.append(key, v));
    } else {
      existing.forEach(v => current.append(key, v));
      current.append(key, value);
    }
    
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  };

  const setSingleParam = (key: string, value: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (value === null || value === '') {
      current.delete(key);
    } else {
      current.set(key, value);
    }
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
    setLocalSearch('');
  };

  // --------------------------------------------------
  // Dependent Region Logic
  // --------------------------------------------------
  const availableCities = React.useMemo(() => {
    if (activeStates.length === 0) return REGION_HIERARCHY.flatMap(r => r.cities);
    return REGION_HIERARCHY.filter(r => activeStates.includes(r.state)).flatMap(r => r.cities);
  }, [activeStates]);

  // --------------------------------------------------
  // Filter Logic & Dynamic Counts
  // --------------------------------------------------
  const filteredProducts = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return products.filter((p: any) => {
      if (searchString && !p.name.toLowerCase().includes(searchString.toLowerCase())) return false;
      if (activeCategories.length > 0 && !activeCategories.includes(p.categoryId)) return false;
      if (activeMaterials.length > 0 && !activeMaterials.some(m => (p.material || '').toLowerCase().includes(m.toLowerCase()))) return false;
      if (activeColors.length > 0 && !(p.colors || p.availableColors || [p.color] || []).some((c: string) => activeColors.includes(c))) return false;
      if (activeSupplierIds.length > 0 && !activeSupplierIds.includes(p.supplierId)) return false;
      if (activeCertifications.length > 0 && !(p.certifications || []).some((c: string) => activeCertifications.includes(c))) return false;
      if (p.pricePerMeter < minPrice || p.pricePerMeter > maxPrice) return false;
      if (p.moq > maxMoq) return false;

      // Supplier & Location Logic
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sup = suppliers.find((s: any) => s.id === p.supplierId);
      if (sup) {
        if (isVerifiedOnly && !sup.verified) return false;
        if (activeSupplierTypes.length > 0 && !activeSupplierTypes.includes(sup.businessType || 'Manufacturer')) return false;
        
        if (activeStates.length > 0 && !activeStates.includes(sup.location?.state)) return false;
        if (activeCities.length > 0 && !activeCities.includes(sup.location?.city)) return false;
      } else if (activeStates.length > 0 || activeCities.length > 0 || isVerifiedOnly || activeSupplierTypes.length > 0) {
        return false; // Product has no supplier info, but supplier filters are active
      }

      return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).sort((a: any, b: any) => {
      if (sortBy === 'price_asc') return a.pricePerMeter - b.pricePerMeter;
      if (sortBy === 'price_desc') return b.pricePerMeter - a.pricePerMeter;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'moq') return a.moq - b.moq;
      return 0; // newest placeholder
    });
  }, [products, suppliers, searchString, activeCategories, activeMaterials, activeColors, activeSupplierIds, activeCertifications, minPrice, maxPrice, maxMoq, isVerifiedOnly, activeSupplierTypes, activeStates, activeCities, sortBy]);

  // Helper to calculate dynamic count for a specific filter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFilterCount = (filterFn: (p: any, sup: any) => boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return products.filter((p: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sup = suppliers.find((s: any) => s.id === p.supplierId);
      return filterFn(p, sup);
    }).length;
  };

  // --------------------------------------------------
  // Render Active Badges
  // --------------------------------------------------
  const renderActiveFilters = () => {
    const activeFilters = [
      ...activeCategories.map(id => ({ key: 'category', val: id, label: categories.find(c => c.id === id)?.name || id })),
      ...activeMaterials.map(m => ({ key: 'material', val: m, label: m })),
      ...activeStates.map(s => ({ key: 'state', val: s, label: s })),
      ...activeCities.map(c => ({ key: 'city', val: c, label: c })),
      ...activeSupplierTypes.map(t => ({ key: 'businessType', val: t, label: t })),
      ...activeCertifications.map(c => ({ key: 'cert', val: c, label: c })),
    ];
    if (isVerifiedOnly) activeFilters.push({ key: 'verified', val: 'true', label: 'Verified Only' });

    if (activeFilters.length === 0) return null;

    return (
      <div className="mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-semibold">Active Filters</h4>
          <Button variant="link" size="sm" onClick={clearAllFilters} className="h-auto p-0 text-xs text-muted-foreground">Clear All</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeFilters.map(f => (
            <Badge key={`${f.key}-${f.val}`} variant="secondary" className="px-2 py-1 flex items-center gap-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-medium hover:bg-slate-100 cursor-default">
              {f.label}
              <X className="h-3 w-3 cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-white" onClick={() => f.key === 'verified' ? setSingleParam('verified', null) : toggleArrayParam(f.key, f.val)} />
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  // --------------------------------------------------
  // Render Accordion Filters (Shared Desktop/Mobile)
  // --------------------------------------------------
  const renderFiltersSidebar = () => (
    <div className="space-y-6">
      {renderActiveFilters()}
      
      {/* @ts-expect-error Accordion type mismatch with base-ui */}
      <Accordion type="multiple" defaultValue={['product']} className="w-full">
        
        {/* PRODUCT GROUP */}
        <AccordionItem value="product" className="border-b-0 mb-4 bg-white dark:bg-card rounded-2xl border px-4 shadow-sm">
          <AccordionTrigger className="text-sm font-bold hover:no-underline py-4">Product Attributes</AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-6">
              {/* Category */}
              <div>
                <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Category</h5>
                <div className="space-y-2">
                  {categories.map((c: {id: string, name: string}) => {
                    const count = getFilterCount(p => p.categoryId === c.id);
                    if (count === 0 && !activeCategories.includes(c.id)) return null;
                    return (
                      <div key={c.id} className="flex items-center space-x-2">
                        <Checkbox id={`cat-${c.id}`} checked={activeCategories.includes(c.id)} onCheckedChange={() => toggleArrayParam('category', c.id)} />
                        <label htmlFor={`cat-${c.id}`} className="text-sm cursor-pointer flex-1">{c.name}</label>
                        <span className="text-xs text-slate-400">({count})</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Material */}
              <div>
                <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Material</h5>
                <div className="space-y-2">
                  {MATERIALS.map((m) => {
                    const count = getFilterCount(p => (p.material || '').toLowerCase().includes(m.toLowerCase()));
                    if (count === 0 && !activeMaterials.includes(m)) return null;
                    return (
                      <div key={m} className="flex items-center space-x-2">
                        <Checkbox id={`mat-${m}`} checked={activeMaterials.includes(m)} onCheckedChange={() => toggleArrayParam('material', m)} />
                        <label htmlFor={`mat-${m}`} className="text-sm cursor-pointer flex-1">{m}</label>
                        <span className="text-xs text-slate-400">({count})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* LOCATION GROUP */}
        <AccordionItem value="location" className="border-b-0 mb-4 bg-white dark:bg-card rounded-2xl border px-4 shadow-sm">
          <AccordionTrigger className="text-sm font-bold hover:no-underline py-4">Sourcing Location</AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-6">
              <div>
                <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">State</h5>
                <div className="max-h-48 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                  {REGION_HIERARCHY.map((r) => {
                    const count = getFilterCount((p, sup) => sup?.location?.state === r.state);
                    if (count === 0 && !activeStates.includes(r.state)) return null;
                    return (
                      <div key={r.state} className="flex items-center space-x-2">
                        <Checkbox id={`state-${r.state}`} checked={activeStates.includes(r.state)} onCheckedChange={() => toggleArrayParam('state', r.state)} />
                        <label htmlFor={`state-${r.state}`} className="text-sm cursor-pointer flex-1">{r.state}</label>
                        <span className="text-xs text-slate-400">({count})</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dependent City List */}
              {availableCities.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">City</h5>
                  {availableCities.length > 5 && (
                    <div className="relative mb-3">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <Input type="text" placeholder="Search City..." className="h-8 pl-8 text-xs" value={citySearch} onChange={e => setCitySearch(e.target.value)} />
                    </div>
                  )}
                  <div className="max-h-48 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {availableCities.filter(c => c.toLowerCase().includes(citySearch.toLowerCase())).map((c) => {
                      const count = getFilterCount((p, sup) => sup?.location?.city === c);
                      if (count === 0 && !activeCities.includes(c)) return null;
                      return (
                        <div key={c} className="flex items-center space-x-2">
                          <Checkbox id={`city-${c}`} checked={activeCities.includes(c)} onCheckedChange={() => toggleArrayParam('city', c)} />
                          <label htmlFor={`city-${c}`} className="text-sm cursor-pointer flex-1">{c}</label>
                          <span className="text-xs text-slate-400">({count})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SUPPLIER GROUP */}
        <AccordionItem value="supplier" className="border-b-0 mb-4 bg-white dark:bg-card rounded-2xl border px-4 shadow-sm">
          <AccordionTrigger className="text-sm font-bold hover:no-underline py-4">Supplier Details</AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/50 transition-colors">
                <Checkbox id="verified-only" checked={isVerifiedOnly} onCheckedChange={(checked) => setSingleParam('verified', checked ? 'true' : null)} className="border-emerald-600 data-[state=checked]:bg-emerald-600" />
                <label htmlFor="verified-only" className="text-sm font-bold cursor-pointer text-emerald-800 dark:text-emerald-400 flex-1">Verified Suppliers Only</label>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 mt-4">Business Type</h5>
                <div className="space-y-2">
                  {BUSINESS_TYPES.map((type) => {
                    const count = getFilterCount((p, sup) => sup?.businessType === type);
                    if (count === 0 && !activeSupplierTypes.includes(type)) return null;
                    return (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox id={`type-${type}`} checked={activeSupplierTypes.includes(type)} onCheckedChange={() => toggleArrayParam('businessType', type)} />
                        <label htmlFor={`type-${type}`} className="text-sm cursor-pointer flex-1">{type}</label>
                        <span className="text-xs text-slate-400">({count})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* COMMERCIAL GROUP */}
        <AccordionItem value="commercial" className="border-b-0 mb-4 bg-white dark:bg-card rounded-2xl border px-4 shadow-sm">
          <AccordionTrigger className="text-sm font-bold hover:no-underline py-4">Commercial Details</AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Price Range (₹)</h5>
                  <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">₹{minPrice} - ₹{maxPrice === 5000 ? '5000+' : maxPrice}</span>
                </div>
                <Slider defaultValue={[0, 5000]} max={5000} step={100} value={[minPrice, maxPrice]} onValueChange={(val) => { const v = val as number[]; setSingleParam('minPrice', v[0].toString()); setSingleParam('maxPrice', v[1].toString()); }} className="my-4" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Max MOQ (Meters)</h5>
                  <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">≤ {maxMoq === 10000 ? '10k+' : maxMoq}</span>
                </div>
                <Slider defaultValue={[10000]} max={10000} step={100} value={[maxMoq]} onValueChange={(val) => { const v = val as number[]; setSingleParam('maxMoq', v[0].toString()); }} className="my-4" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* QUALITY GROUP */}
        <AccordionItem value="quality" className="border-b-0 bg-white dark:bg-card rounded-2xl border px-4 shadow-sm">
          <AccordionTrigger className="text-sm font-bold hover:no-underline py-4">Quality & Certifications</AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-2">
              {CERTIFICATIONS.map((cert) => {
                const count = getFilterCount(p => (p.certifications || []).includes(cert));
                if (count === 0 && !activeCertifications.includes(cert)) return null;
                return (
                  <div key={cert} className="flex items-center space-x-2">
                    <Checkbox id={`cert-${cert}`} checked={activeCertifications.includes(cert)} onCheckedChange={() => toggleArrayParam('cert', cert)} />
                    <label htmlFor={`cert-${cert}`} className="text-sm cursor-pointer flex-1">{cert}</label>
                    <span className="text-xs text-slate-400">({count})</span>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start relative pb-12">
      
      {/* -------------------------------------------------- */}
      {/* DESKTOP SIDEBAR */}
      {/* -------------------------------------------------- */}
      <div className="hidden md:block w-72 shrink-0 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar pr-4">
        <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
          <Filter className="h-5 w-5" />
          <h2 className="text-xl font-bold tracking-tight">Filters</h2>
        </div>
        {renderFiltersSidebar()}
      </div>

      {/* -------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* -------------------------------------------------- */}
      <div className="flex-1 min-w-0 w-full flex flex-col space-y-6">
        
        {/* TOP TOOLBAR: Search, Sort, Mobile Sheet */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-card p-3 rounded-2xl border shadow-sm sticky top-20 z-10">
          
          <div className="w-full sm:max-w-md relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-slate-400" />
            <Input 
              type="text" 
              placeholder={isListening ? "Listening..." : "Search fabrics, properties, mills..."}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setSingleParam('q', localSearch);
              }}
              onBlur={() => setSingleParam('q', localSearch)}
              className="w-full h-11 pl-10 pr-20 rounded-xl bg-slate-50 dark:bg-slate-900 border-none shadow-inner text-sm focus-visible:ring-1 focus-visible:ring-emerald-500 transition-all"
            />
            <div className="absolute right-2 flex items-center gap-1">
              {localSearch && (
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-700 rounded-full" onClick={() => { setLocalSearch(''); setSingleParam('q', null); }}>
                  <X className="h-4 w-4" />
                </Button>
              )}
              {supported && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleListening}
                  className={`h-7 w-7 rounded-full ${isListening ? 'text-red-500 animate-pulse bg-red-50' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            {/* Mobile Filter Sheet Trigger */}
            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
              <SheetTrigger render={
                <Button variant="outline" className="md:hidden flex-1 rounded-xl h-11 border-dashed font-semibold text-slate-700 dark:text-slate-300">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters {(activeCategories.length + activeStates.length + activeMaterials.length) > 0 && <Badge className="ml-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Active</Badge>}
                </Button>
              } />
              <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 flex flex-col border-l-0 shadow-2xl">
                <SheetHeader className="p-6 border-b bg-slate-50 dark:bg-slate-900/50 text-left">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" /> Filters
                    </SheetTitle>
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-muted-foreground">Clear All</Button>
                  </div>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                  {renderFiltersSidebar()}
                </div>
                <div className="p-4 border-t bg-white dark:bg-card">
                  <Button className="w-full h-12 rounded-xl text-md font-bold shadow-lg" onClick={() => setIsMobileFiltersOpen(false)}>
                    Show {filteredProducts.length} Results
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={(val) => val && setSingleParam('sort', val)}>
              <SelectTrigger className="w-full sm:w-[200px] h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-none font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <ArrowUpDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400"/> 
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border shadow-xl">
                <SelectItem value="newest" className="font-medium cursor-pointer">Newest Arrivals</SelectItem>
                <SelectItem value="price_asc" className="font-medium cursor-pointer">Price: Low to High</SelectItem>
                <SelectItem value="price_desc" className="font-medium cursor-pointer">Price: High to Low</SelectItem>
                <SelectItem value="rating" className="font-medium cursor-pointer">Highest Rated</SelectItem>
                <SelectItem value="moq" className="font-medium cursor-pointer">Lowest MOQ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Info Banner */}
        <div className="flex items-center justify-between px-1">
          <div className="text-sm font-medium text-slate-500">
            Showing <span className="font-extrabold text-slate-900 dark:text-white mx-1">{filteredProducts.length}</span> matching products
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* PRODUCT GRID */}
        {/* -------------------------------------------------- */}
        {filteredProducts.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {filteredProducts.map((product: any) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const supplier = suppliers.find((s:any) => s.id === product.supplierId);
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={product.id || product._id}
                  >
                    <ProductCard
                      id={product.id || product._id}
                      title={product.name}
                      supplier={supplier?.name || 'ABC Textiles Pvt Ltd'}
                      supplierLocation={supplier?.location ? `${supplier.location.city}, ${supplier.location.state}` : 'Surat, Gujarat'}
                      supplierType={supplier?.businessType || 'Manufacturer'}
                      price={product.pricePerMeter}
                      moq={product.moq}
                      leadTimeDays={product.leadTimeDays || 7}
                      rating={product.rating || supplier?.rating || 4.8}
                      reviewCount={product.reviewCount || 124}
                      image={product.images && product.images.length > 0 ? product.images[0] : ''}
                      material={product.composition || product.material}
                      gsm={product.weightGSM || product.gsm}
                      width={product.width || product.widthCM}
                      badges={product.certifications ? product.certifications.slice(0, 2) : []}
                      isVerified={supplier?.verified ?? true}
                      onAddToCart={() => {
                        const cartProduct = { ...product, id: product.id || product._id };
                        addToCart(cartProduct, product.moq || 100);
                        toast.success(`${product.name} added to cart`);
                      }}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center justify-center text-center bg-white dark:bg-card rounded-3xl border shadow-sm h-[50vh]">
            <div className="bg-slate-50 dark:bg-slate-900 h-24 w-24 rounded-full flex items-center justify-center mb-6">
              <Search className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">No products found</h3>
            <p className="text-slate-500 max-w-md mb-8">
              We couldn't find any fabrics matching your exact filter combination. Try broadening your search or removing some region filters.
            </p>
            <Button size="lg" className="rounded-xl px-8" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
