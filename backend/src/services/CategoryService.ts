import { CategoryRepository } from '../repositories/CategoryRepository';
import { ICategory } from '../models/Category';
import { NotFoundError } from '../errors/CustomErrors';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async getAllCategories(): Promise<ICategory[]> {
    return await this.categoryRepository.findAll();
  }

  async getCategoryTree(): Promise<ICategory[]> {
    return await this.categoryRepository.getHierarchicalCategories();
  }

  async getCategoryById(id: string): Promise<ICategory> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundError('Category not found');
    return category;
  }
}
