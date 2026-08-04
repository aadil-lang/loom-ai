import { Request, Response, NextFunction } from 'express';
import { SupplierOnboardingWorkflow } from '../../ai/workflows/SupplierOnboardingWorkflow';
import { InMemoryProvider } from '../../ai/memory/InMemoryProvider';
import { HumanMessage } from '@langchain/core/messages';
import { ApiResponse } from '../../responses/ApiResponse';
import { OnboardingStage } from '../../ai/schemas/OnboardingSchemas';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../../services/auth/AuthService';
import { RegisterSupplierDto } from '../../dto/auth/RegisterSupplierDto';

const memoryProvider = new InMemoryProvider();
const workflow = new SupplierOnboardingWorkflow().build();
const authService = new AuthService();

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

  confirmRegistration = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId, password } = req.body;
      if (!sessionId || !password) {
        return res.status(400).json(ApiResponse.error('Session ID and password are required', 400));
      }

      const state = await memoryProvider.loadContext(sessionId);
      if (state.currentStage !== OnboardingStage.CONFIRMATION) {
        return res.status(400).json(ApiResponse.error('Onboarding is not complete yet.', 400));
      }

      const data = state.collectedData;
      
      const dto: RegisterSupplierDto = {
        email: data.email as string,
        password,
        name: data.companyName || 'Unknown',
        contactName: data.contactName || 'Unknown',
        location: data.country || 'Unknown',
        certifications: data.certifications,
        capabilities: data.fabricTypes
      };

      const result = await authService.registerSupplier(dto);
      
      // Clear memory after successful registration
      await memoryProvider.clear(sessionId);

      res.status(201).json(ApiResponse.success(result, 'Supplier registered successfully via AI Onboarding'));
    } catch (error) { next(error); }
  }
}
