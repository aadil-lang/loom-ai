import { Category, ICategory } from '../models/Category';
import { BaseRepository } from './BaseRepository';

export class CategoryRepository extends BaseRepository<ICategory> {
  constructor() {
    super(Category);
  }

  async getHierarchicalCategories(): Promise<ICategory[]> {
    // In a full implementation, you'd aggregate the tree here.
    return await this.model.find({ parentCategory: null }).exec();
  }
}
