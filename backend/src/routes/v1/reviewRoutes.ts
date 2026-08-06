import { Router } from 'express';
import { ReviewController } from '../../controllers/marketplace/ReviewController';
import { authenticate } from '../../middleware/auth/authenticate';
import { authorizeRoles } from '../../middleware/auth/authorize';
import { body } from 'express-validator';
import { validateRequest } from '../../middleware/validateRequest';

const router = Router();
const reviewController = new ReviewController();

const reviewValidator = [
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().isString().isLength({ max: 100 }),
  body('comment').optional().isString().isLength({ max: 1000 }),
];

// Publicly readable
router.get('/product/:productId', reviewController.getReviewsByProduct);
router.get('/:id', reviewController.getReviewById);

// Protected Dashboards
router.get('/dashboard/buyer', authenticate, authorizeRoles('Buyer'), reviewController.getReviewsByBuyer);
router.get('/dashboard/supplier', authenticate, authorizeRoles('Supplier'), reviewController.getReviewsBySupplier);

// Protected (Buyer only)
router.post('/', authenticate, authorizeRoles('Buyer'), reviewValidator, validateRequest, reviewController.createReview);
router.put('/:id', authenticate, authorizeRoles('Buyer'), reviewValidator, validateRequest, reviewController.updateReview);
router.delete('/:id', authenticate, authorizeRoles('Buyer'), reviewController.deleteReview);

export default router;
