import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../responses/ApiResponse';
import { AIEventBus } from '../../ai/orchestration/AIEventBus';
import { ApprovalQueue } from '../../ai/orchestration/ApprovalQueue';

const approvalQueue = ApprovalQueue.getInstance();

export class WorkflowController {
  
  triggerEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, payload } = req.body;
      if (!type || !payload) {
        return res.status(400).json(ApiResponse.error('Type and payload are required', 400));
      }

      // In production, this might be restricted to internal microservices
      AIEventBus.emitEvent(type, payload);

      res.status(200).json(ApiResponse.success(null, `Event ${type} emitted successfully`));
    } catch (error) { next(error); }
  };

  getPendingApprovals = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json(ApiResponse.error('Unauthorized', 401));

      const actions = await approvalQueue.getPendingActions(user.id);

      res.status(200).json(ApiResponse.success(actions, 'Pending approvals retrieved'));
    } catch (error) { next(error); }
  };

  resolveApproval = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // 'approved' | 'rejected'
      const user = req.user;

      if (!user) return res.status(401).json(ApiResponse.error('Unauthorized', 401));
      if (status !== 'approved' && status !== 'rejected') {
        return res.status(400).json(ApiResponse.error('Status must be approved or rejected', 400));
      }

      const action = await approvalQueue.resolveAction(id as string, status, user.id);
      
      if (!action) {
        return res.status(404).json(ApiResponse.error('Pending action not found', 404));
      }

      // If approved, in a real scenario we would now execute the payload.
      // e.g. if action.type === 'auto_restock', call OrderService to draft PO.

      res.status(200).json(ApiResponse.success(action, `Action ${status} successfully`));
    } catch (error) { next(error); }
  };
}
