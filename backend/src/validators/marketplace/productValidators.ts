import { query, param } from 'express-validator';
import mongoose from 'mongoose';

export const productQueryValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer').toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100').toInt(),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be a positive number').toFloat(),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be a positive number').toFloat(),
  query('category').optional().custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid Category ID');
    }
    return true;
  }),
  query('supplier').optional().custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid Supplier ID');
    }
    return true;
  }),
  query('weaveType').optional().isString(),
  query('industryApplications').optional().isString(),
  query('sustainabilityRating').optional().isString(),
];

export const objectIdParamValidator = (paramName: string) => [
  param(paramName).custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error(`Invalid ID format for ${paramName}`);
    }
    return true;
  }),
];
