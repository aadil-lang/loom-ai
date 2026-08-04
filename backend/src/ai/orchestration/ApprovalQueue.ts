import { v4 as uuidv4 } from 'uuid';

export interface PendingAction {
  id: string;
  userId: string;
  type: string;
  description: string;
  payload: any;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

/**
 * In-memory store for AI actions that require Human-in-the-Loop approval.
 * In production, this would be a MongoDB collection.
 */
export class ApprovalQueue {
  private static instance: ApprovalQueue;
  private queue: PendingAction[] = [];

  private constructor() {}

  public static getInstance(): ApprovalQueue {
    if (!ApprovalQueue.instance) {
      ApprovalQueue.instance = new ApprovalQueue();
    }
    return ApprovalQueue.instance;
  }

  public async queueAction(userId: string, type: string, description: string, payload: any): Promise<PendingAction> {
    const action: PendingAction = {
      id: uuidv4(),
      userId,
      type,
      description,
      payload,
      status: 'pending',
      createdAt: new Date()
    };
    this.queue.push(action);
    return action;
  }

  public async getPendingActions(userId: string): Promise<PendingAction[]> {
    return this.queue.filter(a => a.userId === userId && a.status === 'pending');
  }

  public async resolveAction(actionId: string, status: 'approved' | 'rejected', userId: string): Promise<PendingAction | null> {
    const action = this.queue.find(a => a.id === actionId && a.userId === userId);
    if (!action) return null;
    
    action.status = status;
    return action;
  }
}
