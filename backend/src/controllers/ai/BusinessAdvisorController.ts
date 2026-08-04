import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../responses/ApiResponse';
import { BusinessAdvisorWorkflow } from '../../ai/workflows/BusinessAdvisorWorkflow';

const workflow = new BusinessAdvisorWorkflow().build();

export class BusinessAdvisorController {
  
  generateReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json(ApiResponse.error('Unauthorized', 401));
      }

      // We expect req.user to have role 'supplier' or 'buyer'
      const userType = user.role === 'supplier' ? 'supplier' : 'buyer';
      
      const initialState = {
        userType,
        userId: user.id,
        rawMetrics: {},
        marketContext: null,
        generatedReport: null
      };

      const finalState = await workflow.invoke(initialState);
      const finalStateAny = finalState as any;

      if (!finalStateAny.generatedReport) {
        return res.status(500).json(ApiResponse.error('Failed to generate report', 500));
      }

      res.status(200).json(ApiResponse.success(finalStateAny.generatedReport, 'Business report generated successfully'));
    } catch (error) { next(error); }
  };
}
