import api from '../api';

export interface CreateReviewDto {
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateReviewDto {
  rating?: number;
  title?: string;
  comment?: string;
}

export const reviewService = {
  getReviewsByProduct: async (productId: string) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },

  getBuyerDashboardReviews: async () => {
    const response = await api.get(`/reviews/dashboard/buyer`);
    return response.data;
  },

  getSupplierDashboardReviews: async () => {
    const response = await api.get(`/reviews/dashboard/supplier`);
    return response.data;
  },

  getReviewById: async (id: string) => {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },

  createReview: async (data: CreateReviewDto) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  updateReview: async (id: string, data: UpdateReviewDto) => {
    const response = await api.put(`/reviews/${id}`, data);
    return response.data;
  },

  deleteReview: async (id: string) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  }
};
