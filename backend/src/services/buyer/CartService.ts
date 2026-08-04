import { CartRepository } from '../../repositories/CartRepository';
import { ProductRepository } from '../../repositories/ProductRepository';
import { ICart } from '../../models/Cart';
import { AddToCartDto, UpdateCartItemDto } from '../../dto/buyer/CartDto';
import { NotFoundError, ValidationError } from '../../errors/CustomErrors';
import mongoose from 'mongoose';

export class CartService {
  private cartRepository: CartRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
  }

  async getCart(buyerId: string): Promise<ICart> {
    return await this.cartRepository.findByBuyerOrCreate(buyerId);
  }

  async addItem(buyerId: string, dto: AddToCartDto): Promise<ICart> {
    const product = await this.productRepository.findById(dto.productId);
    if (!product) throw new NotFoundError('Product not found');
    if (!product.inStock) throw new ValidationError('Product is out of stock');
    if (dto.quantity < product.moq) throw new ValidationError(`Minimum order quantity is ${product.moq}`);

    const cart = await this.cartRepository.findByBuyerOrCreate(buyerId);
    
    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(item => item.productId._id.toString() === dto.productId);
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += dto.quantity;
    } else {
      cart.items.push({ productId: product._id as mongoose.Types.ObjectId, quantity: dto.quantity });
    }

    await cart.save();
    return await this.getCart(buyerId); // return populated
  }

  async updateItemQuantity(buyerId: string, itemId: string, dto: UpdateCartItemDto): Promise<ICart> {
    const cart = await this.cartRepository.findByBuyerOrCreate(buyerId);
    const itemIndex = cart.items.findIndex(item => item.productId._id.toString() === itemId);
    
    if (itemIndex === -1) throw new NotFoundError('Item not found in cart');
    
    cart.items[itemIndex].quantity = dto.quantity;
    await cart.save();
    return await this.getCart(buyerId);
  }

  async removeItem(buyerId: string, itemId: string): Promise<ICart> {
    const cart = await this.cartRepository.findByBuyerOrCreate(buyerId);
    cart.items = cart.items.filter(item => item.productId._id.toString() !== itemId);
    await cart.save();
    return await this.getCart(buyerId);
  }

  async clearCart(buyerId: string): Promise<void> {
    await this.cartRepository.clearCart(buyerId);
  }
}
