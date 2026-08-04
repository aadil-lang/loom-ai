import { Router } from 'express';

import authRoutes from './authRoutes';

const router = Router();

router.use('/auth', authRoutes);

// Routes will be mounted here in subsequent sprints
// router.use('/buyers', buyerRoutes);
// router.use('/suppliers', supplierRoutes);
// router.use('/products', productRoutes);

export default router;
