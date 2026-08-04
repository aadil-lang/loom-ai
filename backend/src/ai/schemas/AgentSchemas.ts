import { z } from 'zod';

export const ProductRecommendationSchema = z.object({
  recommendations: z.array(z.object({
    productId: z.string(),
    reasoning: z.string().describe('Explain why this product is recommended based on the user query.'),
    confidenceScore: z.number().min(0).max(1)
  })),
  summary: z.string().describe('A brief summary of the recommendations provided.')
});

export const BusinessInsightSchema = z.object({
  metricsAnalyzed: z.array(z.string()),
  keyInsights: z.array(z.string()),
  recommendedActions: z.array(z.string()).describe('Actionable steps the supplier should take based on the data.'),
  urgencyLevel: z.enum(['Low', 'Medium', 'High'])
});
