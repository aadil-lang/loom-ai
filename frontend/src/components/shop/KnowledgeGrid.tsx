import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

const ARTICLES = [
  { title: 'Understanding Fabric GSM: A Buyer\'s Guide', readTime: '5 min read', category: 'Sourcing Basics', img: 'https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=600&q=80' },
  { title: 'The Rise of Sustainable Organic Cotton in India', readTime: '7 min read', category: 'Sustainability', img: 'https://images.unsplash.com/photo-1621871239853-29a583344641?w=600&q=80' },
  { title: 'How to Verify GOTS Certifications', readTime: '4 min read', category: 'Compliance', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80' },
];

export function KnowledgeGrid() {
  return (
    <section className="py-24 bg-white dark:bg-card">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Textile Knowledge Centre</h2>
          <p className="text-lg text-muted-foreground">Expert guides, sourcing manuals, and industry insights to help you procure better.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article, idx) => (
            <Link prefetch={false} key={idx} href="/knowledge">
              <Card className="h-full border-0 shadow-none bg-transparent group cursor-pointer">
                <div className="relative h-64 w-full rounded-3xl overflow-hidden mb-6 shadow-md">
                  <Image src={article.img} alt={article.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-black hover:bg-white backdrop-blur-sm border-0 font-bold px-3 py-1">
                      {article.category}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground font-medium">
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold leading-snug group-hover:text-primary transition-colors">{article.title}</h3>
                  <p className="text-primary font-semibold flex items-center group-hover:underline">Read Article <ArrowRight className="w-4 h-4 ml-1" /></p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
