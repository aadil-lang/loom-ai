import { Router } from 'express';

import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import buyerRoutes from './buyerRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/buyer', buyerRoutes);

// Routes will be mounted here in subsequent sprints
// router.use('/suppliers', supplierRoutes);
// router.use('/products', productRoutes);

export default router;
