import { Router } from 'express';

import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import buyerRoutes from './buyerRoutes';
import supplierRoutes from './supplierRoutes';
import aiRoutes from './aiRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/buyer', buyerRoutes);
router.use('/supplier', supplierRoutes);
router.use('/ai', aiRoutes);

// Routes will be mounted here in subsequent sprints
// router.use('/admin', adminRoutes);
// router.use('/products', productRoutes);

export default router;
