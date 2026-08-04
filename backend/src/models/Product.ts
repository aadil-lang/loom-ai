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
  width: string; // e.g., '58/60 inches'
  fabricType: string; // e.g., 'Woven', 'Knit'
  colors: string[];
  tags: string[];
  certifications: string[];
  isFeatured: boolean;
  viewCount: number;
  rating: number;
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
    width: { type: String, required: true },
    fabricType: { type: String, required: true },
    colors: [{ type: String }],
    tags: [{ type: String }],
    certifications: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

// Indexes for fast searching and discovery
ProductSchema.index({ 
  name: 'text', 
  description: 'text', 
  fabricType: 'text', 
  tags: 'text', 
  composition: 'text' 
});
ProductSchema.index({ supplierId: 1 });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ isFeatured: -1, createdAt: -1 });
ProductSchema.index({ viewCount: -1 });
ProductSchema.index({ pricePerMeter: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
