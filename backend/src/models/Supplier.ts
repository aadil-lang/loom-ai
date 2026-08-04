import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  email: string;
  contactName: string;
  location: string;
  rating: number;
  certifications: string[];
  capabilities: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SupplierSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactName: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, default: 0 },
    certifications: [{ type: String }],
    capabilities: [{ type: String }],
  },
  { timestamps: true }
);

export const Supplier = mongoose.model<ISupplier>('Supplier', SupplierSchema);
