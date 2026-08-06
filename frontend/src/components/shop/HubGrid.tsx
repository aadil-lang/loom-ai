import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

const TEXTILE_HUBS = [
  { name: "Surat", state: "Gujarat", desc: "Synthetic Fabrics, Sarees", count: "3,200+", img: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400&q=80" },
  { name: "Ahmedabad", state: "Gujarat", desc: "Denim, Cotton", count: "2,100+", img: "https://images.unsplash.com/photo-1542272201-b1ca555f8505?w=400&q=80" },
  { name: "Tiruppur", state: "Tamil Nadu", desc: "Knitwear, T-Shirts", count: "2,800+", img: "https://images.unsplash.com/photo-1584346937222-79017fbbcc73?w=400&q=80" },
  { name: "Ludhiana", state: "Punjab", desc: "Woollens, Winter Wear", count: "1,500+", img: "https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=400&q=80" },
  { name: "Panipat", state: "Haryana", desc: "Home Furnishings, Rugs", count: "1,100+", img: "https://images.unsplash.com/photo-1554562097-f13c6bfa6b67?w=400&q=80" },
  { name: "Bhilwara", state: "Rajasthan", desc: "Suiting, Shirting", count: "800+", img: "https://images.unsplash.com/photo-1610030469983-98e550d61dc0?w=400&q=80" },
  { name: "Ichalkaranji", state: "Maharashtra", desc: "Powerloom, Woven", count: "1,200+", img: "https://images.unsplash.com/photo-1596455607563-ad6193f76b13?w=400&q=80" },
  { name: "Varanasi", state: "Uttar Pradesh", desc: "Banarasi Silk", count: "1,400+", img: "https://images.unsplash.com/photo-1600161476481-30d8eb2c1e48?w=400&q=80" }
];

export function HubGrid() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-600/30 bg-emerald-500/10 px-4 py-1.5 text-sm uppercase tracking-widest mb-4">
            Regional Sourcing
          </Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Explore India's Master Textile Hubs
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            India’s textile heritage is deeply regional. From the synthetic powerlooms of Surat to the knitwear capital of Tiruppur — source directly from specialized hubs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TEXTILE_HUBS.map((hub) => (
            <Link prefetch={false} key={hub.name} href={`/marketplace?hub=${hub.name.toLowerCase()}`}>
              <div className="group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="h-40 w-full overflow-hidden relative">
                  <Image src={hub.img} alt={hub.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <Badge className="absolute top-3 left-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-white/10">
                    {hub.state}
                  </Badge>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl">{hub.name}</h3>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md text-xs">
                      {hub.count}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{hub.desc}</p>
                  <div className="flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all">
                    Explore Hub <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link prefetch={false} href="/marketplace">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 font-bold h-14 shadow-lg hover:shadow-xl transition-all">
              Browse All Regions <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
