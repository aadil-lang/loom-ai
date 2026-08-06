import api from '../api';

export const knowledgeService = {
  searchArticles: async (params: { q?: string; category?: string; difficulty?: string; tags?: string; page?: number; limit?: number; sort?: string }) => {
    const response = await api.get('/knowledge/search', { params });
    return response.data;
  },

  getArticleBySlug: async (slug: string) => {
    const response = await api.get(`/knowledge/${slug}`);
    return response.data;
  },

  getRelatedArticles: async (slug: string) => {
    const response = await api.get(`/knowledge/related/${slug}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/knowledge/categories');
    return response.data;
  }
};
