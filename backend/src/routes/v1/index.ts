import { Router } from 'express';

import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);

// Routes will be mounted here in subsequent sprints
// router.use('/buyers', buyerRoutes);
// router.use('/suppliers', supplierRoutes);
// router.use('/products', productRoutes);

export default router;
