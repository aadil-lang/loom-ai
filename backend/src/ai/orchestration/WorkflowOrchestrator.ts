import { AIEventBus, AIEvent } from './AIEventBus';
import { BusinessAdvisorWorkflow } from '../workflows/BusinessAdvisorWorkflow';
import { AiNotificationService } from '../services/AiNotificationService';
import { ApprovalQueue } from './ApprovalQueue';

export class WorkflowOrchestrator {
  private advisorWorkflow = new BusinessAdvisorWorkflow().build();
  private notificationService = new AiNotificationService();
  private approvalQueue = ApprovalQueue.getInstance();

  constructor() {
    this.registerListeners();
  }

  private registerListeners() {
    AIEventBus.on('inventory_low', this.handleInventoryLow.bind(this));
    AIEventBus.on('demand_spike', this.handleDemandSpike.bind(this));
    AIEventBus.on('user_registered', this.handleUserRegistered.bind(this));
    console.log('[Orchestrator] AI Event listeners registered.');
  }

  private async handleInventoryLow(event: AIEvent) {
    console.log(`[Orchestrator] Triggering Business Advisor for inventory low on product ${event.payload.productId}`);
    try {
      const { supplierId, productId } = event.payload;

      // 1. Trigger specialized agent
      const initialState = {
        userType: 'supplier',
        userId: supplierId,
        rawMetrics: {},
        marketContext: null,
        generatedReport: null
      };

      const finalState: any = await this.advisorWorkflow.invoke(initialState);
      const report = finalState.generatedReport;

      // 2. Format a recommendation and push it to HITL Queue instead of auto-executing
      const description = `AI has detected low inventory for product ${productId}. We recommend restocking based on forecasted demand. Approve to automatically generate a purchase order draft.`;
      
      await this.approvalQueue.queueAction(
        supplierId, 
        'auto_restock', 
        description, 
        { productId, recommendedQuantity: 500, report }
      );

      // 3. Notify the user that an AI action is pending
      await this.notificationService.sendNotification(
        supplierId, 
        'AI Alert: Inventory Action Required', 
        `Action required for product ${productId}. Please review your pending AI approvals.`
      );

    } catch (error) {
      console.error('[Orchestrator] Failed to handle inventory_low', error);
    }
  }

  private async handleDemandSpike(event: AIEvent) {
    // Similar to above but perhaps queues a price adjustment recommendation
    console.log('[Orchestrator] Handled demand spike');
  }

  private async handleUserRegistered(event: AIEvent) {
    // Welcomes the user, potentially queues an automated follow up
    console.log('[Orchestrator] Handled user registration');
  }
}
