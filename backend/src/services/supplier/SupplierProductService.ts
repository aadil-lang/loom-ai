import { ProductRepository } from '../../repositories/ProductRepository';
import { IProduct } from '../../models/Product';
import { CreateProductDto, UpdateProductDto, ReorderImagesDto } from '../../dto/supplier/ProductDto';
import { NotFoundError, ForbiddenError } from '../../errors/CustomErrors';
import mongoose from 'mongoose';

export class SupplierProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getProducts(supplierId: string): Promise<IProduct[]> {
    return await this.productRepository.findBySupplier(supplierId);
  }

  async createProduct(supplierId: string, dto: CreateProductDto): Promise<IProduct> {
    return await this.productRepository.create({
      ...dto,
      supplierId: new mongoose.Types.ObjectId(supplierId),
      categoryId: new mongoose.Types.ObjectId(dto.categoryId)
    } as any);
  }

  async updateProduct(supplierId: string, productId: string, dto: UpdateProductDto): Promise<IProduct> {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found');
    if (product.supplierId.toString() !== supplierId) throw new ForbiddenError('Access denied');

    if (dto.categoryId) {
      (dto as any).categoryId = new mongoose.Types.ObjectId(dto.categoryId);
    }

    return await this.productRepository.update(productId, dto as any) as IProduct;
  }

  async deleteProduct(supplierId: string, productId: string): Promise<void> {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found');
    if (product.supplierId.toString() !== supplierId) throw new ForbiddenError('Access denied');

    // Soft delete
    await this.productRepository.update(productId, { productStatus: 'archived' } as any);
  }

  async reorderImages(supplierId: string, productId: string, dto: ReorderImagesDto): Promise<IProduct> {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found');
    if (product.supplierId.toString() !== supplierId) throw new ForbiddenError('Access denied');

    return await this.productRepository.update(productId, { images: dto.images } as any) as IProduct;
  }
}
