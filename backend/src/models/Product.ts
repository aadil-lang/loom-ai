import mongoose, { Schema, Document } from 'mongoose';

export interface IProductVariant {
  color?: string;
  shade?: string;
  rollLength?: number;
  batchNumber?: string;
  priceAdjustment?: number;
  quantity?: number;
}

export interface IProduct extends Document {
  // Existing required fields
  supplierId: string;
  categoryId: string;
  name: string;
  sku: string;
  description: string;
  pricePerMeter: number;
  moq: number;
  composition: string;
  weightGSM: number;
  width: string;
  fabricType: string;
  colors: string[];
  tags: string[];
  certifications: string[];
  isFeatured: boolean;
  viewCount: number;
  rating: number;
  inStock: boolean;
  images: string[];
  
  // Future-Proofing: Basic Info
  productCode?: string;
  brand?: string;
  collectionName?: string;
  productStatus?: 'active' | 'draft' | 'archived';
  searchKeywords?: string[];

  // Future-Proofing: Textile Specs
  weaveType?: string;
  knitType?: string;
  thickness?: string;
  stretchability?: string;
  texture?: string;
  finish?: string;
  pattern?: string;
  opacity?: string;
  weightCategory?: string;
  shrinkage?: string;

  // Future-Proofing: Variants
  variants?: IProductVariant[];

  // Future-Proofing: Manufacturing
  manufacturer?: string;
  countryOfOrigin?: string;
  leadTimeDays?: number;
  productionCapacity?: string;

  // Future-Proofing: Sustainability
  sustainabilityRating?: string;
  carbonFootprint?: string;
  recycledMaterialPercentage?: number;

  // Future-Proofing: Commercial
  currency?: string;
  bulkPricingRules?: any[];
  discountRules?: any[];
  reservedQuantity?: number;
  stockStatus?: string;

  // Future-Proofing: Care & Industry
  industryApplications?: string[];
  washingInstructions?: string;
  dryingInstructions?: string;
  ironingInstructions?: string;
  careSymbols?: string[];
  recommendedUsage?: string;

  // Future-Proofing: Logistics
  packagingType?: string;
  shippingWeight?: number;
  warehouseLocation?: string;
  availabilityRegions?: string[];

  // Future-Proofing: Extended Media
  primaryImage?: string;
  galleryImages?: string[];
  videos?: string[];
  technicalDatasheets?: string[];
  certificationsFiles?: string[];
  preview3d?: string;

  // Future-Proofing: AI Metadata (RAG / Semantics)
  semanticTags?: string[];
  embeddingId?: string;
  vectorDocumentId?: string;
  aiSummary?: string;
  aiDescription?: string;

  // Future-Proofing: Recommendations
  similarProductIds?: string[];
  frequentlyBoughtTogether?: string[];
  complementaryProducts?: string[];
  trendingScore?: number;
  popularityScore?: number;
  recommendationWeight?: number;

  // Future-Proofing: Business Intelligence
  searchCount?: number;
  orderCount?: number;
  conversionRate?: number;
  inventoryTurnover?: number;
  revenueContribution?: number;
  customerRatingSummary?: string;
  returnRate?: number;

  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema<IProductVariant>({
  color: { type: String },
  shade: { type: String },
  rollLength: { type: Number },
  batchNumber: { type: String },
  priceAdjustment: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 }
}, { _id: false });

const ProductSchema: Schema = new Schema(
  {
    supplierId: { type: String, ref: 'Supplier', required: true },
    categoryId: { type: String, ref: 'Category', required: true },
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

    productCode: { type: String },
    brand: { type: String },
    collectionName: { type: String },
    productStatus: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
    searchKeywords: [{ type: String }],

    weaveType: { type: String },
    knitType: { type: String },
    thickness: { type: String },
    stretchability: { type: String },
    texture: { type: String },
    finish: { type: String },
    pattern: { type: String },
    opacity: { type: String },
    weightCategory: { type: String },
    shrinkage: { type: String },

    variants: [ProductVariantSchema],

    manufacturer: { type: String },
    countryOfOrigin: { type: String },
    leadTimeDays: { type: Number },
    productionCapacity: { type: String },

    sustainabilityRating: { type: String },
    carbonFootprint: { type: String },
    recycledMaterialPercentage: { type: Number },

    currency: { type: String, default: 'USD' },
    bulkPricingRules: [{ type: Schema.Types.Mixed }],
    discountRules: [{ type: Schema.Types.Mixed }],
    reservedQuantity: { type: Number, default: 0 },
    stockStatus: { type: String },

    industryApplications: [{ type: String }],
    washingInstructions: { type: String },
    dryingInstructions: { type: String },
    ironingInstructions: { type: String },
    careSymbols: [{ type: String }],
    recommendedUsage: { type: String },

    packagingType: { type: String },
    shippingWeight: { type: Number },
    warehouseLocation: { type: String },
    availabilityRegions: [{ type: String }],

    primaryImage: { type: String },
    galleryImages: [{ type: String }],
    videos: [{ type: String }],
    technicalDatasheets: [{ type: String }],
    certificationsFiles: [{ type: String }],
    preview3d: { type: String },

    semanticTags: [{ type: String }],
    embeddingId: { type: String },
    vectorDocumentId: { type: String },
    aiSummary: { type: String },
    aiDescription: { type: String },

    similarProductIds: [{ type: String, ref: 'Product' }],
    frequentlyBoughtTogether: [{ type: String, ref: 'Product' }],
    complementaryProducts: [{ type: String, ref: 'Product' }],
    trendingScore: { type: Number, default: 0 },
    popularityScore: { type: Number, default: 0 },
    recommendationWeight: { type: Number, default: 0 },

    searchCount: { type: Number, default: 0 },
    orderCount: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    inventoryTurnover: { type: Number, default: 0 },
    revenueContribution: { type: Number, default: 0 },
    customerRatingSummary: { type: String },
    returnRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for fast searching and discovery
ProductSchema.index({ 
  name: 'text', 
  description: 'text', 
  fabricType: 'text', 
  tags: 'text', 
  composition: 'text',
  searchKeywords: 'text'
});
ProductSchema.index({ supplierId: 1, createdAt: -1 });
ProductSchema.index({ categoryId: 1, createdAt: -1 });
ProductSchema.index({ isFeatured: -1, createdAt: -1 });
ProductSchema.index({ viewCount: -1 });
ProductSchema.index({ pricePerMeter: 1 });
ProductSchema.index({ fabricType: 1, pricePerMeter: 1 });
ProductSchema.index({ 'colors': 1 });
ProductSchema.index({ productStatus: 1 });
// Future-ready indexes
ProductSchema.index({ trendingScore: -1 });
ProductSchema.index({ popularityScore: -1 });
ProductSchema.index({ 'variants.color': 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
