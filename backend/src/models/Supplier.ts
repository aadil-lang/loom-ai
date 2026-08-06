import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  email: string;
  password?: string;
  contactName: string;
  location: string;
  rating: number;
  certifications: string[]; // Keep as string[] for names or URLs
  capabilities: string[];
  
  // New Supplier Profile Extensions
  companyDescription?: string;
  operatingRegions?: string[];
  businessHours?: string;
  logoUrl?: string;
  bannerUrl?: string;
  
  businessSettings?: {
    currency?: string;
    timeZone?: string;
    languagePreference?: string;
    notificationPreferences?: Record<string, boolean>;
  };
  role: 'Supplier';
  isEmailVerified: boolean;
  accountStatus: 'active' | 'suspended';
  refreshToken?: string;
  lastLogin?: Date;
  failedLoginAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const SupplierSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    contactName: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, default: 0 },
    certifications: [{ type: String }],
    capabilities: [{ type: String }],
    
    companyDescription: { type: String },
    operatingRegions: [{ type: String }],
    businessHours: { type: String },
    logoUrl: { type: String },
    bannerUrl: { type: String },
    
    businessSettings: {
      currency: { type: String, default: 'USD' },
      timeZone: { type: String, default: 'UTC' },
      languagePreference: { type: String, default: 'en' },
      notificationPreferences: { type: Map, of: Boolean }
    },
    role: { type: String, default: 'Supplier', enum: ['Supplier'] },
    isEmailVerified: { type: Boolean, default: false },
    accountStatus: { type: String, default: 'active', enum: ['active', 'suspended'] },
    refreshToken: { type: String, select: false },
    lastLogin: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for fast searching and discovery
SupplierSchema.index({ rating: -1 });
SupplierSchema.index({ location: 1 });
SupplierSchema.index({ accountStatus: 1 });

export const Supplier = mongoose.model<ISupplier>('Supplier', SupplierSchema);
