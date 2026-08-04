import { Router } from 'express';
import { SupplierController } from '../../controllers/supplier/SupplierController';
import { authenticate } from '../../middleware/auth/authenticate';
import { authorizeRoles } from '../../middleware/auth/authorize';
import { validateRequest } from '../../middleware/validateRequest';
import { updateSupplierProfileValidator, createProductValidator, updateInventoryValidator, orderStatusValidator } from '../../validators/supplier/supplierValidators';
import { objectIdParamValidator } from '../../validators/marketplace/productValidators';

const router = Router();
const controller = new SupplierController();

// Apply Auth Middleware to all routes
router.use(authenticate, authorizeRoles('Supplier'));

// Profile & Settings
router.get('/profile', controller.getProfile);
router.put('/profile', updateSupplierProfileValidator, validateRequest, controller.updateProfile);
router.put('/settings', controller.updateSettings);

// Products
router.get('/products', controller.getProducts);
router.post('/products', createProductValidator, validateRequest, controller.createProduct);
router.put('/products/:id', objectIdParamValidator('id'), validateRequest, controller.updateProduct);
router.delete('/products/:id', objectIdParamValidator('id'), validateRequest, controller.deleteProduct);
router.patch('/products/:id/images/reorder', objectIdParamValidator('id'), validateRequest, controller.reorderImages);

// Inventory
router.patch('/inventory/:productId', objectIdParamValidator('productId'), updateInventoryValidator, validateRequest, controller.updateInventory);
router.post('/inventory/bulk-update', controller.bulkUpdateInventory);

// Orders
router.get('/orders', controller.getOrders);
router.get('/orders/:id', objectIdParamValidator('id'), validateRequest, controller.getOrderDetails);
router.patch('/orders/:id/status', objectIdParamValidator('id'), orderStatusValidator, validateRequest, controller.updateOrderStatus);

// Dashboard
router.get('/dashboard', controller.getDashboardSummary);

export default router;
