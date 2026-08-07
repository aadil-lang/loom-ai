'use client';

import * as React from 'react';
import { useSearchKnowledge, useKnowledgeCategories } from '@/hooks/useKnowledge';
import { ArticleCard } from '@/components/knowledge/ArticleCard';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string>('');

  const { data: catResponse } = useKnowledgeCategories();
  const categories = catResponse?.data || [];

  const { data: searchResponse, isLoading } = useSearchKnowledge({
    q: searchTerm,
    category: activeCategory,
    limit: 12
  });

  const articles = searchResponse?.data?.data || [];
  
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl space-y-16">
        
        {/* Header section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <Badge className="mb-4">LoomAI Knowledge Center</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Everything you need to know about textiles.</h1>
          <p className="text-lg text-muted-foreground">From foundational concepts to enterprise procurement and AI readiness, master the B2B textile market.</p>
          
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              placeholder="Search articles, guides, and tutorials..." 
              className="pl-12 h-14 rounded-full text-base bg-background border-2 shadow-sm focus-visible:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <Button 
            variant={activeCategory === '' ? 'default' : 'outline'} 
            onClick={() => setActiveCategory('')}
            className="rounded-full"
          >
            All Articles
          </Button>
          {categories.map((cat: string) => (
            <Button 
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              onClick={() => setActiveCategory(cat)}
              className="rounded-full"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" /> 
              {searchTerm ? `Search Results for "${searchTerm}"` : activeCategory ? `${activeCategory} Articles` : 'Featured Knowledge'}
            </h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={`skeleton-${i}`} className="h-[400px] bg-muted/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article: any) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-muted/20 rounded-3xl border border-dashed">
              <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or category filter.</p>
              <Button variant="outline" className="mt-6" onClick={() => { setSearchTerm(''); setActiveCategory(''); }}>Clear Filters</Button>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto pt-16">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <Accordion className="w-full bg-card rounded-2xl border p-4 shadow-sm">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-semibold">What is MOQ?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Minimum Order Quantity (MOQ) represents the lowest quantity of a certain product that a supplier is willing to sell. If the buyer cannot purchase the MOQ, the supplier will generally not accept the order.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-semibold">How do I verify certifications?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Certifications like GOTS or OEKO-TEX can be verified by requesting the certificate number from the supplier and checking it against the official issuing body's database.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-semibold">What affects fabric shrinkage?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Shrinkage is primarily affected by the fiber composition, yarn structure, fabric construction, and the finishing processes applied. Natural fibers typically shrink more than synthetics.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left font-semibold">How are prices calculated?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Prices per meter are typically calculated based on raw material costs, processing (dyeing/printing), manufacturing overhead, and transportation. Bulk orders often unlock tiered discounts.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  )
}
