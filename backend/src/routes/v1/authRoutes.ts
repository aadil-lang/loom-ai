import { Router } from 'express';
import { AuthController } from '../../controllers/AuthController';
import { validateRequest } from '../../middleware/validateRequest';
import { authenticate } from '../../middleware/auth/authenticate';
import { authorizeRoles } from '../../middleware/auth/authorize';
import { 
  registerBuyerValidator, 
  registerSupplierValidator, 
  loginValidator, 
  refreshValidator 
} from '../../validators/auth/authValidators';
import { authLimiter } from '../../middleware/auth/authLimiter';

const router = Router();
const authController = new AuthController();

// Buyer Auth
router.post('/buyer/register', authLimiter, registerBuyerValidator, validateRequest, authController.registerBuyer);
router.post('/buyer/login', authLimiter, loginValidator, validateRequest, authController.loginBuyer);

// Supplier Auth
router.post('/supplier/register', authLimiter, registerSupplierValidator, validateRequest, authController.registerSupplier);
router.post('/supplier/login', authLimiter, loginValidator, validateRequest, authController.loginSupplier);

// Shared / Utility
router.post('/refresh', authLimiter, refreshValidator, validateRequest, authController.refreshToken);

// Protected Routes
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.me);
router.post('/change-password', authenticate, authController.changePassword);

// Example of a role-specific protected route for RBAC testing
router.get('/buyer/dashboard', authenticate, authorizeRoles('Buyer'), (req, res) => {
  res.json({ message: 'Buyer dashboard accessed' });
});

router.get('/supplier/dashboard', authenticate, authorizeRoles('Supplier'), (req, res) => {
  res.json({ message: 'Supplier dashboard accessed' });
});

export default router;
