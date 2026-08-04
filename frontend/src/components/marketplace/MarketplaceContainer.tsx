'use client';

import * as React from 'react';
import { ProductCard } from './ProductCard';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Slider } from '../ui/slider';
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { EmptyState } from '../ui/states';
import { motion, AnimatePresence } from 'framer-motion';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MarketplaceContainer({ products, categories, suppliers, colors }: { products: any[], categories: any[], suppliers: any[], colors: any[] }) {
  const [search, setSearch] = React.useState('');
  const [selectedCats, setSelectedCats] = React.useState<string[]>([]);
  const [selectedSups, setSelectedSups] = React.useState<string[]>([]);
  const [selectedCols, setSelectedCols] = React.useState<string[]>([]);
  const [priceRange, setPriceRange] = React.useState([0, 100]);
  const [sortBy, setSortBy] = React.useState('newest');

  const toggleArray = (arr: string[], val: string, setArr: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (arr.includes(val)) setArr(arr.filter(a => a !== val));
    else setArr([...arr, val]);
  };

  const filteredProducts = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return products.filter((p: any) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCats.length > 0 && !selectedCats.includes(p.categoryId)) return false;
      if (selectedSups.length > 0 && !selectedSups.includes(p.supplierId)) return false;
      if (selectedCols.length > 0 && !p.availableColors.some((c: string) => selectedCols.includes(c))) return false;
      if (p.pricePerMeter < priceRange[0] || p.pricePerMeter > priceRange[1]) return false;
      return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).sort((a: any, b: any) => {
      if (sortBy === 'price_asc') return a.pricePerMeter - b.pricePerMeter;
      if (sortBy === 'price_desc') return b.pricePerMeter - a.pricePerMeter;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'moq') return a.moq - b.moq;
      return 0; // newest placeholder
    });
  }, [products, search, selectedCats, selectedSups, selectedCols, priceRange, sortBy]);

  const renderFiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Price Range</h3>
        <Slider defaultValue={[0, 100]} max={100} step={1} value={priceRange} onValueChange={(val) => setPriceRange(val as number[])} className="mb-2" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1] === 100 ? '100+' : priceRange[1]}</span>
        </div>
      </div>

      {/* @ts-expect-error Accordion type mismatch with base-ui */}
      <Accordion type="multiple" defaultValue={['category', 'supplier', 'color']} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2.5 pt-1">
              {categories.map((c: {id: string, name: string}) => (
                <div key={c.id} className="flex items-center space-x-2">
                  <Checkbox id={`cat-${c.id}`} checked={selectedCats.includes(c.id)} onCheckedChange={() => toggleArray(selectedCats, c.id, setSelectedCats)} />
                  <label htmlFor={`cat-${c.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">{c.name}</label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="supplier">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">Supplier</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2.5 pt-1">
              {suppliers.map((s: {id: string, name: string}) => (
                <div key={s.id} className="flex items-center space-x-2">
                  <Checkbox id={`sup-${s.id}`} checked={selectedSups.includes(s.id)} onCheckedChange={() => toggleArray(selectedSups, s.id, setSelectedSups)} />
                  <label htmlFor={`sup-${s.id}`} className="text-sm font-medium leading-none cursor-pointer">{s.name}</label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="color">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">Colors</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 pt-1">
              {colors.map((c: {id: string, name: string, hex: string}) => (
                <button
                  key={c.id}
                  onClick={() => toggleArray(selectedCols, c.id, setSelectedCols)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${selectedCols.includes(c.id) ? 'ring-2 ring-primary ring-offset-2' : 'border-transparent shadow-sm'}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Desktop Sidebar Filters */}
      <div className="hidden md:block w-64 shrink-0">
        <div className="sticky top-24">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-5 w-5" />
            <h2 className="text-lg font-bold">Filters</h2>
            {(selectedCats.length > 0 || selectedSups.length > 0 || selectedCols.length > 0) && (
              <Button variant="ghost" size="sm" className="ml-auto h-auto px-2 text-xs text-muted-foreground" onClick={() => { setSelectedCats([]); setSelectedSups([]); setSelectedCols([]); setPriceRange([0, 100]); }}>
                Clear all
              </Button>
            )}
          </div>
          {renderFiltersContent()}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 space-y-6">
        
        {/* Search and Sort Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-2 rounded-2xl border shadow-sm">
          <div className="w-full sm:w-96 relative">
            <input 
              type="text" 
              placeholder="Search fabrics, mills, or SKUs..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-4 pr-10 rounded-xl bg-transparent border-none focus:ring-0 text-sm outline-none"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 px-2 sm:px-0 pb-2 sm:pb-0">
            {/* Mobile Filter Trigger */}
            <Sheet>
              {/* @ts-expect-error SheetTrigger type mismatch with base-ui */}
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden flex-1 rounded-xl h-10 border-dashed">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={() => { setSelectedCats([]); setSelectedSups([]); setSelectedCols([]); setPriceRange([0, 100]); }}>Clear</Button>
                </div>
                {renderFiltersContent()}
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={(val) => val && setSortBy(val)}>
              <SelectTrigger className="w-[180px] h-10 rounded-xl border-none bg-muted/50 hover:bg-muted font-medium">
                <div className="flex items-center gap-2 text-muted-foreground"><ArrowUpDown className="h-4 w-4"/> <SelectValue /></div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="newest">Newest Arrivals</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="moq">Lowest MOQ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground mx-1">{filteredProducts.length}</span> products
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {filteredProducts.map((product: any) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const supplier = suppliers.find((s:any) => s.id === product.supplierId);
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    key={product.id}
                  >
                    <ProductCard
                      id={product.id}
                      title={product.name}
                      supplier={supplier?.name || 'Unknown Supplier'}
                      price={product.pricePerMeter}
                      moq={product.moq}
                      rating={product.rating}
                      image={product.images[0]}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="py-20">
            <EmptyState 
              title="No products found" 
              description="We couldn't find any products matching your current filters and search criteria. Try removing some filters."
              actionText="Clear all filters"
              onAction={() => {
                setSearch('');
                setSelectedCats([]);
                setSelectedSups([]);
                setSelectedCols([]);
                setPriceRange([0, 100]);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
