import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  supplierId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  description: string;
  pricePerMeter: number;
  moq: number; // Minimum Order Quantity
  composition: string;
  weightGSM: number;
  inStock: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    pricePerMeter: { type: Number, required: true },
    moq: { type: Number, required: true },
    composition: { type: String, required: true },
    weightGSM: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

// Indexes for fast searching
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ supplierId: 1 });
ProductSchema.index({ categoryId: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
