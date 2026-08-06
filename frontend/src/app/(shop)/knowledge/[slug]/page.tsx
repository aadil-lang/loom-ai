'use client';

import * as React from 'react';
import { useKnowledgeArticle, useRelatedArticles } from '@/hooks/useKnowledge';
import { MarkdownRenderer } from '@/components/knowledge/MarkdownRenderer';
import { ArticleCard } from '@/components/knowledge/ArticleCard';
import { Clock, ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'next/navigation';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: response, isLoading, isError } = useKnowledgeArticle(slug);
  const { data: relatedResponse } = useRelatedArticles(slug);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 max-w-4xl py-12 animate-pulse space-y-8">
        <div className="h-8 w-32 bg-muted rounded"></div>
        <div className="h-24 bg-muted rounded-xl"></div>
        <div className="h-[400px] bg-muted rounded-3xl"></div>
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">The article you are looking for does not exist or has been moved.</p>
        <Link href="/knowledge">
          <Button>Return to Knowledge Base</Button>
        </Link>
      </div>
    );
  }

  const article = response.data;
  const relatedArticles = relatedResponse?.data || [];

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Hero Section */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 max-w-4xl py-12 md:py-16">
          <Link href="/knowledge" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Knowledge Base
          </Link>
          
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">{article.category}</span>
              <span className="text-muted-foreground">•</span>
              <Badge variant="outline">{article.difficulty}</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
              {article.summary}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground border-t">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" /> {article.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {new Date(article.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> {article.estimatedReadTime} min read
              </div>
              <div className="ml-auto">
                <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                  <Share2 className="w-4 h-4" /> Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.featuredImage && (
        <div className="container mx-auto px-4 max-w-5xl -mt-8 relative z-10 mb-12">
          <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={article.featuredImage} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`container mx-auto px-4 max-w-3xl ${!article.featuredImage && 'pt-12'}`}>
        <article className="bg-card rounded-3xl border p-8 md:p-12 shadow-sm mb-16">
          <MarkdownRenderer content={article.content} />
          
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="rounded-md">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((related: any) => (
                <ArticleCard key={related._id} article={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
