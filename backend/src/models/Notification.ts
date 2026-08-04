import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId;
  recipientType: 'Buyer' | 'Supplier';
  title: string;
  message: string;
  type: 'order_update' | 'system' | 'message' | 'alert';
  isRead: boolean;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    recipientId: { type: Schema.Types.ObjectId, required: true },
    recipientType: { type: String, enum: ['Buyer', 'Supplier'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['order_update', 'system', 'message', 'alert'], required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

NotificationSchema.index({ recipientId: 1, recipientType: 1, isRead: 1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
