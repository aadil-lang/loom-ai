'use client';

import * as React from 'react';
import { useSupplierReviews } from '@/hooks/useReviews';
import { Rating } from '@/components/marketplace/Rating';
import Link from 'next/link';

export function StoreRatingClient() {
  const { data: response, isLoading } = useSupplierReviews();
  
  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-20 bg-muted rounded-xl"></div>
    </div>;
  }

  const reviews = response?.data || [];
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / totalReviews 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="text-4xl font-extrabold">{avgRating.toFixed(1)}</span>
        <div className="space-y-1">
          <Rating value={avgRating} readOnly size="md" />
          <p className="text-sm text-muted-foreground">{totalReviews} total reviews</p>
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="space-y-3 pt-4 border-t">
          <h4 className="text-sm font-semibold">Latest Feedback</h4>
          {reviews.slice(0, 2).map((review: any) => (
            <div key={review._id} className="p-3 rounded-lg bg-muted/30 text-sm">
              <div className="flex justify-between items-center mb-1">
                <Rating value={review.rating} readOnly size="sm" />
                <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <span className="font-medium text-xs block mb-1">{review.productId?.name}</span>
              <p className="text-muted-foreground text-xs line-clamp-2">&quot;{review.comment}&quot;</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
