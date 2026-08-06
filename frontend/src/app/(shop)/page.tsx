'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/ui/search-bar';
import { CheckCircle2 } from 'lucide-react';

const FabricGrid = dynamic(() => import('@/components/shop/FabricGrid').then(m => m.FabricGrid), { ssr: false, loading: () => <div className="h-[600px] bg-muted animate-pulse" /> });
const IndustryGrid = dynamic(() => import('@/components/shop/IndustryGrid').then(m => m.IndustryGrid), { ssr: false, loading: () => <div className="h-[400px] bg-muted animate-pulse" /> });
const HubGrid = dynamic(() => import('@/components/shop/HubGrid').then(m => m.HubGrid), { ssr: false, loading: () => <div className="h-[500px] bg-muted animate-pulse" /> });
const SupplierGrid = dynamic(() => import('@/components/shop/SupplierGrid').then(m => m.SupplierGrid), { ssr: false, loading: () => <div className="h-[400px] bg-muted animate-pulse" /> });
const KnowledgeGrid = dynamic(() => import('@/components/shop/KnowledgeGrid').then(m => m.KnowledgeGrid), { ssr: false, loading: () => <div className="h-[400px] bg-muted animate-pulse" /> });

export default function EnhancedLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] dark:bg-background">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full py-24 md:py-36 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image src="/images/textile_hero.png" alt="Indian Textile Warehouse" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/20"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <div className="max-w-3xl space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge variant="outline" className="text-amber-400 border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-sm uppercase tracking-widest backdrop-blur-md">
                India's Premium Digital Textile Bazaar
              </Badge>
            </motion.div>
            
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Source Directly from India's Leading Manufacturers
            </motion.h1>
            
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-xl text-slate-300 max-w-2xl font-light">
              Connect with verified mills and exporters across Gujarat, Tamil Nadu, Punjab, and more. Transparent pricing, strict QC, and AI-powered matchmaking.
            </motion.p>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="pt-6 w-full max-w-2xl">
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl flex items-center">
                 <div className="flex-1 text-white">
                   <SearchBar />
                 </div>
                 <Link href="/marketplace">
                   <Button className="ml-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 px-8 font-semibold shadow-lg hidden sm:flex">
                      Search Fabrics
                   </Button>
                 </Link>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-wrap items-center gap-6 pt-8 text-sm text-slate-400 font-medium">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 5,000+ Verified Suppliers</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Secure Escrow Payments</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> End-to-End Tracking</span>
            </motion.div>
          </div>
        </div>
      </section>

      <FabricGrid />

      <IndustryGrid />

      <HubGrid />

      {/* 5. FEATURED COLLECTIONS BANNER */}
      <section className="py-24 bg-white dark:bg-card">
        <div className="container mx-auto px-4 md:px-8">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-emerald-900 shadow-2xl">
            <div className="absolute inset-0">
               <Image src="https://images.unsplash.com/photo-1590614392211-13797c27ec8b?w=1200&q=80" alt="Sustainable Collection" fill sizes="100vw" className="object-cover opacity-40 mix-blend-overlay" />
            </div>
            <div className="relative z-10 p-12 md:p-20 lg:p-24 max-w-3xl text-white space-y-6">
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 px-4 py-1.5 text-sm">New Collection</Badge>
              <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">The 2026 Sustainable & Organic Export Catalog</h2>
              <p className="text-lg md:text-xl text-emerald-50/80 max-w-xl">
                Source GOTS-certified organic cotton, recycled polyester, and ethically milled hemp from our top 50 audited suppliers.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link prefetch={false} href="/marketplace">
                  <Button size="lg" className="bg-white text-emerald-900 hover:bg-slate-100 rounded-full px-8 font-bold h-14">
                    View Collection
                  </Button>
                </Link>
                <Link prefetch={false} href="/knowledge">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 font-bold h-14">
                    Download Catalog (PDF)
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SupplierGrid />

      <KnowledgeGrid />

      {/* 8. BOTTOM CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="container mx-auto px-4 max-w-3xl relative z-10 space-y-8">
          <Badge className="bg-white/20 hover:bg-white/20 text-white border-0 px-4 py-1.5 text-sm uppercase tracking-widest backdrop-blur-sm">
            Join The Future of Trade
          </Badge>
          <h2 className="text-5xl font-extrabold tracking-tight leading-tight">Elevate your textile supply chain today.</h2>
          <p className="text-xl text-primary-foreground/80 font-light">Whether you are a global brand looking for reliable Indian manufacturing, or a local mill looking to export, LoomAI is your platform.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Link prefetch={false} href="/auth/register">
              <Button size="lg" className="rounded-full px-10 h-16 text-lg w-full sm:w-auto bg-white text-primary hover:bg-slate-100 shadow-xl font-bold">
                Start Sourcing for Free
              </Button>
            </Link>
            <Link prefetch={false} href="/auth/register">
              <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg w-full sm:w-auto border-white/30 text-white hover:bg-white/10 font-bold">
                Register as a Manufacturer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
