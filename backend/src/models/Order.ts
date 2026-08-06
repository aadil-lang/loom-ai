import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  priceAtPurchase: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  buyerId: mongoose.Types.ObjectId;
  supplierId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  status: 'Pending' | 'Accepted' | 'Preparing' | 'Ready for Dispatch' | 'In Transit' | 'Completed' | 'Cancelled' | 'Rejected';
  totalValue: number;
  shippingAddress: string; // Simplified for this sprint
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtPurchase: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    buyerId: { type: Schema.Types.ObjectId, ref: 'Buyer', required: true },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    items: [OrderItemSchema],
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Preparing', 'Ready for Dispatch', 'In Transit', 'Completed', 'Cancelled', 'Rejected'],
      default: 'Pending',
    },
    totalValue: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
  },
  { timestamps: true }
);

OrderSchema.index({ buyerId: 1, createdAt: -1 });
OrderSchema.index({ supplierId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
