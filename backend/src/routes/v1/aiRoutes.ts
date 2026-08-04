import { Router } from 'express';
import { OnboardingAgentController } from '../../controllers/ai/OnboardingAgentController';
import { ProcurementAgentController } from '../../controllers/ai/ProcurementAgentController';
import { RAGController } from '../../controllers/ai/RAGController';
import { BusinessAdvisorController } from '../../controllers/ai/BusinessAdvisorController';
import { WorkflowController } from '../../controllers/ai/WorkflowController';
import { authenticate } from '../../middleware/auth/authenticate';
import { WorkflowOrchestrator } from '../../ai/orchestration/WorkflowOrchestrator';
import { BackgroundScheduler } from '../../ai/orchestration/BackgroundScheduler';

const router = Router();
const onboardingController = new OnboardingAgentController();
const procurementController = new ProcurementAgentController();
const ragController = new RAGController();
const advisorController = new BusinessAdvisorController();
const workflowController = new WorkflowController();

// Initialize the central orchestrator and scheduler
new WorkflowOrchestrator();
BackgroundScheduler.getInstance().start();

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

// AI Workflow Automation & HITL
router.post('/workflows/trigger', authenticate, workflowController.triggerEvent);
router.get('/workflows/pending', authenticate, workflowController.getPendingApprovals);
router.post('/workflows/approve/:id', authenticate, workflowController.resolveApproval);

export default router;
