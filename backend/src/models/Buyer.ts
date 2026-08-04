import mongoose, { Schema, Document } from 'mongoose';

export interface IBuyer extends Document {
  name: string;
  email: string;
  password?: string;
  contactName: string;
  phone?: string;
  sourcingPreferences?: string[];
  role: 'Buyer';
  isEmailVerified: boolean;
  accountStatus: 'active' | 'suspended';
  refreshToken?: string;
  lastLogin?: Date;
  failedLoginAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const BuyerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    contactName: { type: String, required: true },
    phone: { type: String },
    sourcingPreferences: [{ type: String }],
    role: { type: String, default: 'Buyer', enum: ['Buyer'] },
    isEmailVerified: { type: Boolean, default: false },
    accountStatus: { type: String, default: 'active', enum: ['active', 'suspended'] },
    refreshToken: { type: String, select: false },
    lastLogin: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Buyer = mongoose.model<IBuyer>('Buyer', BuyerSchema);
