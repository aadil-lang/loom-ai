import { Request, Response } from 'express';
import { SupervisorGraph } from '../../ai/graphs/SupervisorGraph';
import { HumanMessage } from '@langchain/core/messages';

export class UnifiedChatController {
  private supervisorGraph: any;

  constructor() {
    this.supervisorGraph = new SupervisorGraph().build();
  }

  streamChat = async (req: Request, res: Response) => {
    try {
      const { message, sessionId, context } = req.body;
      const user = req.user; // from authenticate middleware

      if (!message) {
        return res.status(400).json({ success: false, message: 'Message is required' });
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      // For LangGraph, we stream the state updates
      const initialState = {
        messages: [new HumanMessage(message)],
        userRole: user?.role || 'Guest',
        userId: user?.id,
        context: context || {}
      };

      const config = { configurable: { thread_id: sessionId || 'default_thread' } };
      
      const stream = await this.supervisorGraph.stream(initialState, config);

      for await (const chunk of stream) {
        // chunk represents the output of the node that just finished
        const nodeName = Object.keys(chunk)[0];
        const stateUpdate = chunk[nodeName];
        
        const data = JSON.stringify({
          node: nodeName,
          nextAgent: stateUpdate.nextAgent,
          content: stateUpdate.messages ? stateUpdate.messages[stateUpdate.messages.length - 1].content : null
        });

        res.write(`data: ${data}\n\n`);
      }

      res.end();
    } catch (error: any) {
      console.error('UnifiedChatController Error:', error);
      res.write(`data: {"error": "${error.message}"}\n\n`);
      res.end();
    }
  };
}
