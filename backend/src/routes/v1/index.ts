import { Router } from 'express';

import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import buyerRoutes from './buyerRoutes';
import supplierRoutes from './supplierRoutes';
import aiRoutes from './aiRoutes';
import reviewRoutes from './reviewRoutes';
import knowledgeRoutes from './knowledgeRoutes';
import analyticsRoutes from './analyticsRoutes';
import { apiCache } from '../../middleware/cache';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/buyer', buyerRoutes);
router.use('/supplier', supplierRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/ai', aiRoutes);
router.use('/reviews', reviewRoutes);
router.use('/knowledge', knowledgeRoutes);

// Routes will be mounted here in subsequent sprints
// router.use('/admin', adminRoutes);
// router.use('/products', productRoutes);

// Marketplace Routes (Cached)
router.use('/products', apiCache(60)); // Cache products for 60 seconds

export default router;
