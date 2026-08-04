import mongoose, { Schema, Document } from 'mongoose';

export interface IBuyer extends Document {
  name: string;
  email: string;
  contactName: string;
  phone?: string;
  sourcingPreferences?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BuyerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactName: { type: String, required: true },
    phone: { type: String },
    sourcingPreferences: [{ type: String }],
  },
  { timestamps: true }
);

export const Buyer = mongoose.model<IBuyer>('Buyer', BuyerSchema);
