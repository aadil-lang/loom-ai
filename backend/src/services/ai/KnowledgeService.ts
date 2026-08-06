import { KnowledgeRepository } from '../../repositories/KnowledgeRepository';
import { NotFoundError } from '../../errors/CustomErrors';

export class KnowledgeService {
  private repository: KnowledgeRepository;

  constructor() {
    this.repository = new KnowledgeRepository();
  }

  async searchArticles(query: string, filters: any, page: number, limit: number, sort: string) {
    return await this.repository.search(query, filters, page, limit, sort);
  }

  async getArticleBySlug(slug: string) {
    const article = await this.repository.findBySlug(slug);
    if (!article) throw new NotFoundError('Knowledge article not found');
    return article;
  }

  async getRelatedArticles(slug: string) {
    const article = await this.repository.findBySlug(slug);
    if (!article) throw new NotFoundError('Knowledge article not found');
    return await this.repository.findRelated(article);
  }

  async getCategories() {
    return await this.repository.getDistinctCategories();
  }
}
