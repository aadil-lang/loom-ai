import { Request, Response, NextFunction } from 'express';
import { BuyerProcurementWorkflow } from '../../ai/workflows/BuyerProcurementWorkflow';
import { InMemoryProvider } from '../../ai/memory/InMemoryProvider';
import { HumanMessage } from '@langchain/core/messages';
import { ApiResponse } from '../../responses/ApiResponse';
import crypto from 'crypto';
import { procurementAgent } from '../../ai/agents/procurementAgent';

const memoryProvider = new InMemoryProvider();
const workflow = new BuyerProcurementWorkflow().build();

export class ProcurementAgentController {
  
  startSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = crypto.randomUUID();
      const initialState = {
        sessionId,
        language: 'en',
        requirements: {},
        foundProducts: [],
        foundSuppliers: [],
        recommendationSummary: null,
        messages: []
      };

      await memoryProvider.saveContext(sessionId, initialState);

      res.status(200).json(ApiResponse.success({ sessionId }, 'Procurement session started'));
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

      const userMessage = new HumanMessage(message);
      const inputState = {
        ...currentState,
        messages: [userMessage]
      };

      const finalState = await workflow.invoke(inputState);

      await memoryProvider.saveContext(sessionId, finalState);

      const finalStateAny = finalState as any;
      const lastMessage = finalStateAny.messages[finalStateAny.messages.length - 1];
      const assistantReply = lastMessage?.content || 'I did not understand that.';

      res.status(200).json(ApiResponse.success({
        reply: assistantReply,
        requirements: finalStateAny.requirements,
        products: finalStateAny.foundProducts,
        suppliers: finalStateAny.foundSuppliers
      }, 'Chat processed'));
    } catch (error) { next(error); }
  };

  simpleChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json(ApiResponse.error('Query is required', 400));
      }
      
      const reply = await procurementAgent(query);
      res.status(200).json(ApiResponse.success({ reply }, 'Simple chat processed'));
    } catch (error) { next(error); }
  };
}
