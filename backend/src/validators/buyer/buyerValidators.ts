import { body } from 'express-validator';
import mongoose from 'mongoose';

export const updateProfileValidator = [
  body('name').optional().isString(),
  body('contactName').optional().isString(),
  body('phone').optional().isString(),
  body('preferredLanguage').optional().isString(),
];

export const createAddressValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('street1').notEmpty().withMessage('Street is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('zip').notEmpty().withMessage('Zip is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('type').isIn(['Billing', 'Shipping']).withMessage('Type must be Billing or Shipping'),
  body('isDefault').optional().isBoolean(),
];

export const addToCartValidator = [
  body('productId').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) throw new Error('Invalid Product ID');
    return true;
  }),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1').toInt(),
];

export const checkoutValidator = [
  body('shippingAddressId').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) throw new Error('Invalid Shipping Address ID');
    return true;
  }),
];
