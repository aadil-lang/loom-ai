import { body } from 'express-validator';

export const registerBuyerValidator = [
  body('name').notEmpty().withMessage('Company Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('contactName').notEmpty().withMessage('Contact Name is required'),
];

export const registerSupplierValidator = [
  body('name').notEmpty().withMessage('Company Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('contactName').notEmpty().withMessage('Contact Name is required'),
  body('location').notEmpty().withMessage('Location is required'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const refreshValidator = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];
