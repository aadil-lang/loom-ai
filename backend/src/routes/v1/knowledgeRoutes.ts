import { Router } from 'express';
import { KnowledgeController } from '../../controllers/ai/KnowledgeController';

const router = Router();
const knowledgeController = new KnowledgeController();

// Publicly readable endpoints (No authentication required to read knowledge base)
router.get('/', knowledgeController.searchArticles); // Used for search/listing
router.get('/search', knowledgeController.searchArticles);
router.get('/categories', knowledgeController.getCategories);
router.get('/:slug', knowledgeController.getArticleBySlug);
router.get('/related/:slug', knowledgeController.getRelatedArticles);

export default router;
