'use client';

import * as React from 'react';
import { useBuyerReviews } from '@/hooks/useReviews';
import { Rating } from '@/components/marketplace/Rating';
import Link from 'next/link';

export function RecentReviewsClient() {
  const { data: response, isLoading } = useBuyerReviews();
  
  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-16 bg-muted rounded-xl"></div>
      <div className="h-16 bg-muted rounded-xl"></div>
    </div>;
  }

  const reviews = response?.data || [];

  if (reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">You haven't left any reviews yet.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.slice(0, 3).map((review: any) => (
        <Link key={review._id} href={`/product/${review.productId?._id || review.productId}`} className="block">
          <div className="p-4 rounded-xl border hover:bg-muted/30 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-sm line-clamp-1">{review.productId?.name || 'Product'}</span>
              <span className="text-xs text-muted-foreground shrink-0">{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
            <Rating value={review.rating} readOnly size="sm" />
            {review.title && <p className="text-xs font-medium mt-2">{review.title}</p>}
            {review.comment && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{review.comment}</p>}
          </div>
        </Link>
      ))}
    </div>
  );
}
