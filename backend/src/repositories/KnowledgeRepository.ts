import { BaseRepository } from './BaseRepository';
import { KnowledgeArticle, IKnowledgeArticle } from '../models/KnowledgeArticle';
import mongoose from 'mongoose';

export class KnowledgeRepository extends BaseRepository<IKnowledgeArticle> {
  constructor() {
    super(KnowledgeArticle);
  }

  async findBySlug(slug: string): Promise<IKnowledgeArticle | null> {
    return await this.model.findOne({ slug, published: true }).exec();
  }

  async findRelated(article: IKnowledgeArticle, limit: number = 3): Promise<IKnowledgeArticle[]> {
    return await this.model.find({
      _id: { $ne: article._id },
      published: true,
      $or: [
        { category: article.category },
        { subcategory: article.subcategory },
        { tags: { $in: article.tags } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .exec();
  }

  async search(
    query: string, 
    filters: { category?: string; tags?: string; difficulty?: string }, 
    page: number = 1, 
    limit: number = 10,
    sortParam: string = 'newest'
  ) {
    const filterQuery: any = { published: true };

    if (query) {
      filterQuery.$text = { $search: query };
    }

    if (filters.category) filterQuery.category = filters.category;
    if (filters.difficulty) filterQuery.difficulty = filters.difficulty;
    if (filters.tags) {
      const tagsArray = filters.tags.split(',').map(t => t.trim());
      filterQuery.tags = { $in: tagsArray };
    }

    let sort: any = { createdAt: -1 };
    if (query) {
      sort = { score: { $meta: 'textScore' } };
    } else {
      if (sortParam === 'alphabetical') sort = { title: 1 };
      else if (sortParam === 'oldest') sort = { createdAt: 1 };
    }

    const total = await this.model.countDocuments(filterQuery);
    const articles = await this.model.find(filterQuery, query ? { score: { $meta: 'textScore' } } : {})
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-content') // Exclude full content in lists for performance
      .exec();

    return { data: articles, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getDistinctCategories() {
    return await this.model.distinct('category', { published: true });
  }
}
