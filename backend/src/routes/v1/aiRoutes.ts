import { Router } from 'express';
import { OnboardingAgentController } from '../../controllers/ai/OnboardingAgentController';
import { ProcurementAgentController } from '../../controllers/ai/ProcurementAgentController';

const router = Router();
const onboardingController = new OnboardingAgentController();
const procurementController = new ProcurementAgentController();

// Supplier Onboarding Routes
router.post('/onboarding/start', onboardingController.startSession);
router.post('/onboarding/chat', onboardingController.chat);
router.post('/onboarding/confirm', onboardingController.confirmRegistration);

// Buyer Procurement Routes (Using authenticate middleware later, public for now)
router.post('/procurement/start', procurementController.startSession);
router.post('/procurement/chat', procurementController.chat);

export default router;
