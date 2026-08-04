import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  email: string;
  password?: string;
  contactName: string;
  location: string;
  rating: number;
  certifications: string[];
  capabilities: string[];
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
    role: { type: String, default: 'Supplier', enum: ['Supplier'] },
    isEmailVerified: { type: Boolean, default: false },
    accountStatus: { type: String, default: 'active', enum: ['active', 'suspended'] },
    refreshToken: { type: String, select: false },
    lastLogin: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Supplier = mongoose.model<ISupplier>('Supplier', SupplierSchema);
