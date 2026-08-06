'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/marketplace/Rating';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5),
  title: z.string().max(100, 'Title is too long').optional(),
  comment: z.string().max(1000, 'Comment is too long').optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  initialValues?: ReviewFormValues;
  onSubmit: (data: ReviewFormValues) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export function ReviewForm({ initialValues, onSubmit, isSubmitting, onCancel }: ReviewFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: initialValues || { rating: 0, title: '', comment: '' },
  });

  const rating = watch('rating');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-6 rounded-2xl bg-card">
      <div className="space-y-2">
        <label className="text-sm font-semibold">Your Rating <span className="text-destructive">*</span></label>
        <Rating 
          value={rating} 
          readOnly={false} 
          size="lg" 
          onChange={(val) => setValue('rating', val, { shouldValidate: true })} 
        />
        {errors.rating && <p className="text-sm text-destructive">{errors.rating.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Title (Optional)</label>
        <input 
          {...register('title')} 
          placeholder="Summarize your experience" 
          className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Review (Optional)</label>
        <textarea 
          {...register('comment')} 
          placeholder="Tell others about the quality, color accuracy, and overall experience..." 
          className="w-full flex min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.comment && <p className="text-sm text-destructive">{errors.comment.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || rating === 0}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
}
