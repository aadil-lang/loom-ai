import Link from 'next/link';
import { Clock, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ArticleCardProps {
  article: any;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/knowledge/${article.slug}`} className="group h-full flex flex-col">
      <div className="border rounded-2xl overflow-hidden bg-card hover:shadow-lg transition-all flex flex-col h-full">
        {article.featuredImage && (
          <div className="relative aspect-[2/1] bg-muted overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={article.featuredImage} 
              alt={article.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
        )}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">{article.category}</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {article.estimatedReadTime} min read
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
            {article.summary}
          </p>
          <div className="flex items-center gap-2 mt-auto">
            <Badge variant={article.difficulty === 'Beginner' ? 'default' : article.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
              {article.difficulty}
            </Badge>
            {article.subcategory && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Tag className="w-3 h-3" /> {article.subcategory}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
