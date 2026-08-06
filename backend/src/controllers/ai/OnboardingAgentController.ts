import { Request, Response, NextFunction } from 'express';
import { SupplierOnboardingWorkflow } from '../../ai/workflows/SupplierOnboardingWorkflow';
import { InMemoryProvider } from '../../ai/memory/InMemoryProvider';
import { HumanMessage } from '@langchain/core/messages';
import { ApiResponse } from '../../responses/ApiResponse';
import { OnboardingStage } from '../../ai/schemas/OnboardingSchemas';
import { v4 as uuidv4 } from 'uuid';
import { SupplierRepository } from '../../repositories/SupplierRepository';

const memoryProvider = new InMemoryProvider();
const workflow = new SupplierOnboardingWorkflow().build();
const supplierRepo = new SupplierRepository();

export class OnboardingAgentController {
  
  startSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = uuidv4();
      const initialState = {
        sessionId,
        language: 'en',
        progress: 0,
        missingFields: [],
        collectedData: {},
        currentStage: OnboardingStage.WELCOME,
        messages: []
      };

      await memoryProvider.saveContext(sessionId, initialState);

      res.status(200).json(ApiResponse.success({ sessionId }, 'Onboarding session started'));
    } catch (error) { next(error); }
  };

  chat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId, message } = req.body;
      if (!sessionId || !message) {
        return res.status(400).json(ApiResponse.error('Session ID and message are required', 400));
      }

      const currentState = await memoryProvider.loadContext(sessionId);
      if (!currentState || !currentState.sessionId) {
        return res.status(404).json(ApiResponse.error('Session not found', 404));
      }

      // Add user message to state
      const userMessage = new HumanMessage(message);
      const inputState = {
        ...currentState,
        messages: [userMessage] // LangGraph reducer will concat this
      };

      // Run the graph
      const finalState = await workflow.invoke(inputState);

      // Save new state
      await memoryProvider.saveContext(sessionId, finalState);

      // Extract the assistant's reply (the last message in the array)
      const finalStateAny = finalState as any;
      const lastMessage = finalStateAny.messages[finalStateAny.messages.length - 1];
      const assistantReply = lastMessage?.content || 'I did not understand that.';

      res.status(200).json(ApiResponse.success({
        reply: assistantReply,
        progress: finalStateAny.progress,
        stage: finalStateAny.currentStage,
        missingFields: finalStateAny.missingFields,
        collectedData: finalStateAny.collectedData
      }, 'Chat processed'));
    } catch (error) { next(error); }
  };

  completeProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json(ApiResponse.error('Session ID is required', 400));
      }

      // Ensure the user is authenticated
      const supplierId = req.user?.id;
      if (!supplierId) {
        return res.status(401).json(ApiResponse.error('Unauthorized. Missing supplier context.', 401));
      }

      const state = await memoryProvider.loadContext(sessionId);
      if (state.currentStage !== OnboardingStage.CONFIRMATION) {
        return res.status(400).json(ApiResponse.error('Profile completion is not finished yet.', 400));
      }

      const data = state.collectedData;
      
      const updatePayload: Record<string, any> = {};
      
      if (data.companyDescription) updatePayload.companyDescription = data.companyDescription;
      if (data.operatingRegions && data.operatingRegions.length > 0) updatePayload.operatingRegions = data.operatingRegions;
      if (data.businessHours) updatePayload.businessHours = data.businessHours;
      if (data.capabilities && data.capabilities.length > 0) updatePayload.capabilities = data.capabilities;
      if (data.certifications && data.certifications.length > 0) updatePayload.certifications = data.certifications;

      const updatedSupplier = await supplierRepo.update(supplierId, updatePayload);
      
      // Clear memory after successful update
      await memoryProvider.clear(sessionId);

      res.status(200).json(ApiResponse.success(updatedSupplier, 'Supplier profile enriched successfully via AI Assistant'));
    } catch (error) { next(error); }
  }
}
