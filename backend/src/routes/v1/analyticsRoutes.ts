import { Router } from 'express';
import { AnalyticsController } from '../../controllers/ai/AnalyticsController';

const router = Router();
const analyticsController = new AnalyticsController();

router.get('/buyer', analyticsController.getBuyerAnalytics);
router.get('/supplier', analyticsController.getSupplierAnalytics);
router.get('/marketplace', analyticsController.getMarketplaceAnalytics);
router.get('/summary', analyticsController.getSummaryAnalytics);

export default router;
