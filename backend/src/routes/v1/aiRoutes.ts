import { Router } from 'express';
import { OnboardingAgentController } from '../../controllers/ai/OnboardingAgentController';
import { ProcurementAgentController } from '../../controllers/ai/ProcurementAgentController';
import { RAGController } from '../../controllers/ai/RAGController';
import { BusinessAdvisorController } from '../../controllers/ai/BusinessAdvisorController';
import { authenticate } from '../../middleware/auth/authenticate';

const router = Router();
const onboardingController = new OnboardingAgentController();
const procurementController = new ProcurementAgentController();
const ragController = new RAGController();
const advisorController = new BusinessAdvisorController();

// Supplier Onboarding Routes
router.post('/onboarding/start', onboardingController.startSession);
router.post('/onboarding/chat', onboardingController.chat);
router.post('/onboarding/confirm', onboardingController.confirmRegistration);

// Buyer Procurement Routes (Using authenticate middleware later, public for now)
router.post('/procurement/start', procurementController.startSession);
router.post('/procurement/chat', procurementController.chat);

// RAG Routes
router.post('/rag/index', ragController.indexDocument);
router.post('/rag/search', ragController.semanticSearch);

// Intelligent Business Solutions
router.get('/advisor/report', authenticate, advisorController.generateReport);

export default router;
