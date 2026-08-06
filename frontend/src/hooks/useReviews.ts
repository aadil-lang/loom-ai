import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService, CreateReviewDto, UpdateReviewDto } from '../services/api/review.service';
import { toast } from 'sonner';

export const useReviewsByProduct = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewService.getReviewsByProduct(productId),
    enabled: !!productId,
  });
};

export const useBuyerReviews = () => {
  return useQuery({
    queryKey: ['buyer-reviews'],
    queryFn: () => reviewService.getBuyerDashboardReviews(),
  });
};

export const useSupplierReviews = () => {
  return useQuery({
    queryKey: ['supplier-reviews'],
    queryFn: () => reviewService.getSupplierDashboardReviews(),
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewDto) => reviewService.createReview(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      toast.success('Review submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit review');
    }
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, productId }: { id: string; data: UpdateReviewDto, productId: string }) => 
      reviewService.updateReview(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      toast.success('Review updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update review');
    }
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, productId }: { id: string, productId: string }) => 
      reviewService.deleteReview(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      toast.success('Review deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete review');
    }
  });
};
