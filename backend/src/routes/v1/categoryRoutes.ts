import { Router } from 'express';
import { CategoryController } from '../../controllers/CategoryController';
import { validateRequest } from '../../middleware/validateRequest';
import { objectIdParamValidator } from '../../validators/marketplace/productValidators';

const router = Router();
const categoryController = new CategoryController();

router.get('/', categoryController.getAllCategories);
router.get('/:id', objectIdParamValidator('id'), validateRequest, categoryController.getCategoryDetails);

export default router;
