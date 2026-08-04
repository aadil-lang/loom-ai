import { z } from 'zod';
import { BaseAgentState } from './GraphState';

export const InsightSchema = z.object({
  title: z.string().describe('Short title for the insight'),
  description: z.string().describe('Detailed explanation of the insight'),
  category: z.enum(['Performance', 'Market', 'Inventory', 'Revenue']).describe('Category of the insight')
});

export const PredictionSchema = z.object({
  metric: z.string().describe('The metric being predicted (e.g. Next Month Revenue, Days to Depletion)'),
  predictedValue: z.string().describe('The forecasted value'),
  confidence: z.number().min(0).max(100).describe('Confidence score from 0-100'),
  reasoning: z.string().describe('Why this prediction was made')
});

export const RecommendationSchema = z.object({
  action: z.string().describe('The suggested action (e.g. Restock Cotton Fabric)'),
  expectedImpact: z.string().describe('The business impact of taking this action'),
  priority: z.enum(['Low', 'Medium', 'High']).describe('Urgency of the action')
});

export const AlertSchema = z.object({
  urgency: z.enum(['Critical', 'Warning', 'Notice']),
  message: z.string().describe('The alert message'),
  triggerCondition: z.string().describe('What caused this alert')
});

export const BusinessReportSchema = z.object({
  executiveSummary: z.string().describe('High-level overview of the business state'),
  insights: z.array(InsightSchema).describe('Key findings from historical data'),
  predictions: z.array(PredictionSchema).describe('Forecasts for the near future'),
  recommendations: z.array(RecommendationSchema).describe('Actionable advice'),
  alerts: z.array(AlertSchema).describe('Proactive warnings')
});

export type BusinessReport = z.infer<typeof BusinessReportSchema>;

export interface BusinessAdvisorState extends BaseAgentState {
  userType: 'supplier' | 'buyer';
  userId: string;
  rawMetrics: any;
  marketContext: string | null;
  generatedReport: BusinessReport | null;
}
