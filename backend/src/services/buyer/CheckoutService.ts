import { CartRepository } from '../../repositories/CartRepository';
import { OrderRepository } from '../../repositories/OrderRepository';
import { ProductRepository } from '../../repositories/ProductRepository';
import { AddressRepository } from '../../repositories/AddressRepository';
import { CheckoutDto } from '../../dto/buyer/CheckoutDto';
import { NotFoundError, ValidationError } from '../../errors/CustomErrors';
import mongoose from 'mongoose';
import { IOrder, IOrderItem } from '../../models/Order';
import crypto from 'crypto';

export class CheckoutService {
  private cartRepository: CartRepository;
  private orderRepository: OrderRepository;
  private productRepository: ProductRepository;
  private addressRepository: AddressRepository;

  constructor() {
    this.cartRepository = new CartRepository();
    this.orderRepository = new OrderRepository();
    this.productRepository = new ProductRepository();
    this.addressRepository = new AddressRepository();
  }

  async processCheckout(buyerId: string, dto: CheckoutDto): Promise<IOrder[]> {
    const cart = await this.cartRepository.findByBuyer(buyerId);
    if (!cart || cart.items.length === 0) {
      throw new ValidationError('Cart is empty');
    }

    const shippingAddress = await this.addressRepository.findById(dto.shippingAddressId);
    if (!shippingAddress || shippingAddress.buyerId.toString() !== buyerId) {
      throw new ValidationError('Invalid shipping address');
    }

    // Group items by supplier to create one order per supplier
    const itemsBySupplier: Record<string, { items: IOrderItem[], totalValue: number }> = {};

    for (const item of cart.items) {
      const product = await this.productRepository.findById(item.productId._id.toString());
      if (!product || !product.inStock) {
        throw new ValidationError(`Product ${product?.name || 'unknown'} is out of stock`);
      }
      if (item.quantity < product.moq) {
        throw new ValidationError(`Product ${product.name} requires MOQ of ${product.moq}`);
      }

      const supplierId = product.supplierId.toString();
      if (!itemsBySupplier[supplierId]) {
        itemsBySupplier[supplierId] = { items: [], totalValue: 0 };
      }

      itemsBySupplier[supplierId].items.push({
        productId: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.pricePerMeter,
      });
      itemsBySupplier[supplierId].totalValue += (item.quantity * product.pricePerMeter);
    }

    // Create Orders
    const orders: IOrder[] = [];
    const formattedAddress = `${shippingAddress.street1}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}, ${shippingAddress.country}`;

    for (const [supplierId, orderData] of Object.entries(itemsBySupplier)) {
      const order = await this.orderRepository.create({
        orderNumber: `ORD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        buyerId: new mongoose.Types.ObjectId(buyerId),
        supplierId: new mongoose.Types.ObjectId(supplierId),
        items: orderData.items,
        totalValue: orderData.totalValue,
        shippingAddress: formattedAddress,
        status: 'Pending'
      });
      orders.push(order);
    }

    // Clear cart after successful checkout
    await this.cartRepository.clearCart(buyerId);

    // AI/Notification hooks will go here in future sprints
    return orders;
  }
}
