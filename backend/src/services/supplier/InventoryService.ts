import { ProductRepository } from '../../repositories/ProductRepository';
import { UpdateInventoryDto, BulkInventoryDto } from '../../dto/supplier/InventoryDto';
import { NotFoundError, ForbiddenError, ValidationError } from '../../errors/CustomErrors';

export class InventoryService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async updateInventory(supplierId: string, productId: string, dto: UpdateInventoryDto) {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found');
    if (product.supplierId.toString() !== supplierId) throw new ForbiddenError('Access denied');

    return await this.productRepository.update(productId, { inStock: dto.inStock } as any);
  }

  async bulkUpdateInventory(supplierId: string, dto: BulkInventoryDto) {
    for (const update of dto.updates) {
      const product = await this.productRepository.findById(update.productId);
      if (product && product.supplierId.toString() === supplierId) {
        await this.productRepository.update(update.productId, { inStock: update.inStock } as any);
      }
    }
    return { success: true, message: 'Bulk update processed' };
  }
}
