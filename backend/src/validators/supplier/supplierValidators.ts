import { body } from 'express-validator';
import mongoose from 'mongoose';

export const updateSupplierProfileValidator = [
  body('name').optional().isString(),
  body('companyDescription').optional().isString(),
];

export const createProductValidator = [
  body('categoryId').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) throw new Error('Invalid Category ID');
    return true;
  }),
  body('name').notEmpty().withMessage('Name is required'),
  body('sku').notEmpty().withMessage('SKU is required'),
  body('pricePerMeter').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('moq').isInt({ min: 1 }).withMessage('MOQ must be at least 1'),
];

export const updateInventoryValidator = [
  body('inStock').isBoolean().withMessage('inStock must be boolean'),
];

export const orderStatusValidator = [
  body('status').isIn(['Accepted', 'Rejected', 'Preparing', 'Ready for Dispatch', 'In Transit', 'Completed'])
    .withMessage('Invalid status transition'),
];
