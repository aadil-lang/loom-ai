import { Router } from 'express';
import { ProductController } from '../../controllers/ProductController';
import { validateRequest } from '../../middleware/validateRequest';
import { productQueryValidator, objectIdParamValidator } from '../../validators/marketplace/productValidators';

const router = Router();
const productController = new ProductController();

// Collections
router.get('/featured', productController.getFeatured);
router.get('/new', productController.getNewArrivals);

// Search & Filter (Core Marketplace Endpoint)
router.get('/search', productQueryValidator, validateRequest, productController.searchProducts);

// Single Resource
router.get('/:id', objectIdParamValidator('id'), validateRequest, productController.getProductDetails);
router.get('/:id/related', objectIdParamValidator('id'), validateRequest, productController.getRelated);

// Standard GET maps to search (with empty query)
router.get('/', productQueryValidator, validateRequest, productController.searchProducts);

export default router;
