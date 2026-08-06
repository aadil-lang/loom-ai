import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Box, Factory, ArrowRight } from 'lucide-react';

const FABRICS = [
  { name: 'Organic Cotton', desc: 'Sustainable & breathable', products: '2,400+', suppliers: '150+', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80' },
  { name: 'Banarasi Silk', desc: 'Premium handwoven silk', products: '850+', suppliers: '45+', img: 'https://images.unsplash.com/photo-1584346937222-79017fbbcc73?w=600&q=80' },
  { name: 'Pure Linen', desc: 'Lightweight & textured', products: '1,200+', suppliers: '85+', img: 'https://images.unsplash.com/photo-1600161476481-30d8eb2c1e48?w=600&q=80' },
  { name: 'Raw Denim', desc: 'Heavyweight & durable', products: '3,100+', suppliers: '200+', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80' },
  { name: 'Merino Wool', desc: 'Warm & natural', products: '600+', suppliers: '35+', img: 'https://images.unsplash.com/photo-1581427181657-b08bcba63a34?w=600&q=80' },
  { name: 'Crushed Velvet', desc: 'Luxurious & soft', products: '450+', suppliers: '25+', img: 'https://images.unsplash.com/photo-1613941423851-f4088a82d02c?w=600&q=80' },
  { name: 'Recycled Polyester', desc: 'Eco-friendly synthetics', products: '4,200+', suppliers: '310+', img: 'https://images.unsplash.com/photo-1574343161094-d42f53443831?w=600&q=80' },
  { name: 'Chiffon', desc: 'Sheer & elegant', products: '1,800+', suppliers: '120+', img: 'https://images.unsplash.com/photo-1554562097-f13c6bfa6b67?w=600&q=80' },
];

export function FabricGrid() {
  return (
    <section className="py-24 bg-white dark:bg-card border-b">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">Browse by Fabric</h2>
            <p className="text-lg text-muted-foreground mt-3 leading-relaxed">Experience our premium showroom. Discover high-quality materials sourced directly from master weavers and state-of-the-art mills.</p>
          </div>
          <Link prefetch={false} href="/categories" className="flex items-center text-primary font-bold hover:underline shrink-0 text-lg">
            Explore All Fabrics <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FABRICS.map((fabric) => (
            <Link prefetch={false} key={fabric.name} href={`/marketplace?category=${encodeURIComponent(fabric.name)}`}>
              <motion.div whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl border">
                <Image src={fabric.img} alt={fabric.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                
                <div className="absolute inset-x-0 bottom-0 p-6 text-white transform transition-transform duration-300">
                  <h3 className="text-2xl font-bold mb-1">{fabric.name}</h3>
                  <p className="text-white/80 text-sm mb-4 font-medium">{fabric.desc}</p>
                  
                  <div className="flex items-center gap-4 text-xs font-semibold text-white/90 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <span className="flex items-center gap-1.5"><Box className="w-3.5 h-3.5" /> {fabric.products} Items</span>
                    <span className="flex items-center gap-1.5"><Factory className="w-3.5 h-3.5" /> {fabric.suppliers} Mills</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
