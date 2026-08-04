import { Router } from 'express';
import { BuyerController } from '../../controllers/buyer/BuyerController';
import { authenticate } from '../../middleware/auth/authenticate';
import { authorizeRoles } from '../../middleware/auth/authorize';
import { validateRequest } from '../../middleware/validateRequest';
import { updateProfileValidator, createAddressValidator, addToCartValidator, checkoutValidator } from '../../validators/buyer/buyerValidators';
import { objectIdParamValidator } from '../../validators/marketplace/productValidators'; // Reusing objectId validator

const router = Router();
const controller = new BuyerController();

// Apply Auth Middleware to all routes
router.use(authenticate, authorizeRoles('Buyer'));

// Profile
router.get('/profile', controller.getProfile);
router.put('/profile', updateProfileValidator, validateRequest, controller.updateProfile);

// Addresses
router.get('/addresses', controller.getAddresses);
router.post('/addresses', createAddressValidator, validateRequest, controller.createAddress);
router.put('/addresses/:id', objectIdParamValidator('id'), validateRequest, controller.updateAddress);
router.delete('/addresses/:id', objectIdParamValidator('id'), validateRequest, controller.deleteAddress);

// Cart
router.get('/cart', controller.getCart);
router.post('/cart', addToCartValidator, validateRequest, controller.addToCart);
router.patch('/cart/:id', objectIdParamValidator('id'), validateRequest, controller.updateCartItem);
router.delete('/cart/:id', objectIdParamValidator('id'), validateRequest, controller.removeCartItem);
router.delete('/cart', controller.clearCart);

// Wishlist
router.get('/wishlist', controller.getWishlist);
router.post('/wishlist', controller.addToWishlist); // Body: { productId }
router.delete('/wishlist/:id', objectIdParamValidator('id'), validateRequest, controller.removeFromWishlist);
router.post('/wishlist/:id/move-to-cart', objectIdParamValidator('id'), validateRequest, controller.moveToCart);

// Checkout
router.post('/checkout', checkoutValidator, validateRequest, controller.checkout);

// Orders
router.get('/orders', controller.getOrders);
router.get('/orders/:id', objectIdParamValidator('id'), validateRequest, controller.getOrderDetails);
router.patch('/orders/:id/cancel', objectIdParamValidator('id'), validateRequest, controller.cancelOrder);

// Notifications
router.get('/notifications', controller.getNotifications);
router.patch('/notifications/read-all', controller.markAllNotificationsRead);
router.patch('/notifications/:id/read', objectIdParamValidator('id'), validateRequest, controller.markNotificationRead);
router.delete('/notifications/:id', objectIdParamValidator('id'), validateRequest, controller.deleteNotification);

export default router;
