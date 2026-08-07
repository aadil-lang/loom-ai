import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  productId: string;
  buyerId: string;
  supplierId: string;
  orderId?: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    productId: { type: String, ref: 'Product', required: true },
    buyerId: { type: String, ref: 'Buyer', required: true },
    supplierId: { type: String, ref: 'Supplier', required: true },
    orderId: { type: String, ref: 'Order' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, maxlength: 100 },
    comment: { type: String, maxlength: 1000 },
    isVerifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
ReviewSchema.index({ productId: 1 });
ReviewSchema.index({ buyerId: 1 });
ReviewSchema.index({ supplierId: 1 });
// Ensure one review per buyer per product
ReviewSchema.index({ productId: 1, buyerId: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
