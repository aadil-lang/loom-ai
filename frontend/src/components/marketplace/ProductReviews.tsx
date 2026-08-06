'use client';

import * as React from 'react';
import { useReviewsByProduct, useSubmitReview, useUpdateReview, useDeleteReview } from '@/hooks/useReviews';
import { useAuth } from '@/context/AuthContext';
import { Rating } from '@/components/marketplace/Rating';
import { ShieldCheck, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { ReviewForm } from './ReviewForm';
import { Button } from '@/components/ui/button';

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const { data: response, isLoading } = useReviewsByProduct(productId);
  const submitReview = useSubmitReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const [isWriting, setIsWriting] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 bg-muted rounded"></div>
      <div className="h-32 bg-muted/50 rounded-2xl"></div>
    </div>;
  }

  const reviews = response?.data || [];
  
  // Aggregate stats
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / totalReviews 
    : 0;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter((r: any) => r.rating === stars).length,
    percentage: totalReviews > 0 ? (reviews.filter((r: any) => r.rating === stars).length / totalReviews) * 100 : 0
  }));

  const userReview = user ? reviews.find((r: any) => r.buyerId?._id === user.id || r.buyerId === user.id) : null;
  const canWriteReview = user?.role === 'Buyer' && !userReview;

  const handleWriteReview = (data: any) => {
    submitReview.mutate({ productId, ...data }, {
      onSuccess: () => setIsWriting(false)
    });
  };

  const handleUpdateReview = (id: string, data: any) => {
    updateReview.mutate({ id, data, productId }, {
      onSuccess: () => setEditingId(null)
    });
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-extrabold">{avgRating.toFixed(1)}</span>
            <div className="space-y-1">
              <Rating value={avgRating} readOnly size="md" />
              <p className="text-sm text-muted-foreground">{totalReviews} reviews</p>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full space-y-2 border-l pl-0 md:pl-8">
          {ratingDistribution.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-3 text-sm">
              <span className="w-12 flex items-center gap-1 font-medium">{stars} <Star className="w-3 h-3" /></span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }} />
              </div>
              <span className="w-8 text-right text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Action */}
      {!isWriting && canWriteReview && (
        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-2">Review this product</h3>
          <p className="text-sm text-muted-foreground mb-4">Share your thoughts with other buyers</p>
          <Button onClick={() => setIsWriting(true)}>Write a Review</Button>
        </div>
      )}

      {/* Review Form (Create) */}
      {isWriting && (
        <div className="pt-4 border-t animate-in fade-in slide-in-from-top-4">
          <h3 className="font-semibold mb-4">Write a Review</h3>
          <ReviewForm 
            onSubmit={handleWriteReview}
            isSubmitting={submitReview.isPending}
            onCancel={() => setIsWriting(false)}
          />
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6 pt-6 border-t">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review: any) => (
            <div key={review._id} className="space-y-3 pb-6 border-b last:border-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {review.buyerId?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{review.buyerId?.name || 'Anonymous'}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      {review.isVerifiedPurchase && (
                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                          <ShieldCheck className="w-3 h-3" /> Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {user?.id === (review.buyerId?._id || review.buyerId) && (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditingId(review._id)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => {
                      if (confirm('Delete this review?')) {
                        deleteReview.mutate({ id: review._id, productId });
                      }
                    }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                )}
              </div>

              {editingId === review._id ? (
                <ReviewForm 
                  initialValues={{ rating: review.rating, title: review.title || '', comment: review.comment || '' }}
                  onSubmit={(data) => handleUpdateReview(review._id, data)}
                  isSubmitting={updateReview.isPending}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="space-y-2 pl-13">
                  <Rating value={review.rating} readOnly size="sm" />
                  {review.title && <h4 className="font-bold text-sm">{review.title}</h4>}
                  {review.comment && <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Just defining Star here since we use it in the distribution bar
function Star(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
