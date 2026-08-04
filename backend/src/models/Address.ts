import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress extends Document {
  buyerId: mongoose.Types.ObjectId;
  title: string; // e.g., 'Headquarters', 'Warehouse 1'
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  type: 'Billing' | 'Shipping';
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema: Schema = new Schema(
  {
    buyerId: { type: Schema.Types.ObjectId, ref: 'Buyer', required: true },
    title: { type: String, required: true },
    street1: { type: String, required: true },
    street2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    type: { type: String, enum: ['Billing', 'Shipping'], required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AddressSchema.index({ buyerId: 1, type: 1 });

export const Address = mongoose.model<IAddress>('Address', AddressSchema);
