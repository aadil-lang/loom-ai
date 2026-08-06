import { useQuery } from '@tanstack/react-query';
import { knowledgeService } from '../services/api/knowledge.service';

export const useSearchKnowledge = (params: { q?: string; category?: string; difficulty?: string; tags?: string; page?: number; limit?: number; sort?: string }) => {
  return useQuery({
    queryKey: ['knowledge-search', params],
    queryFn: () => knowledgeService.searchArticles(params),
  });
};

export const useKnowledgeArticle = (slug: string) => {
  return useQuery({
    queryKey: ['knowledge-article', slug],
    queryFn: () => knowledgeService.getArticleBySlug(slug),
    enabled: !!slug,
  });
};

export const useRelatedArticles = (slug: string) => {
  return useQuery({
    queryKey: ['knowledge-related', slug],
    queryFn: () => knowledgeService.getRelatedArticles(slug),
    enabled: !!slug,
  });
};

export const useKnowledgeCategories = () => {
  return useQuery({
    queryKey: ['knowledge-categories'],
    queryFn: () => knowledgeService.getCategories(),
  });
};
