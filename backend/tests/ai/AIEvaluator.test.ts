import { BusinessAdvisorWorkflow } from '../../src/ai/workflows/BusinessAdvisorWorkflow';
import { z } from 'zod';
import { BusinessReportSchema } from '../../src/ai/schemas/BusinessAdvisorSchemas';

describe('AI Evaluator: Business Advisor Workflow', () => {
  let workflow: any;

  beforeAll(() => {
    // In CI, we would mock LLM responses or use a specialized Evaluation LLM.
    // Here we're ensuring the workflow compiles and handles initial state properly.
    workflow = new BusinessAdvisorWorkflow().build();
  });

  it('should compile the graph successfully', () => {
    expect(workflow).toBeDefined();
    expect(typeof workflow.invoke).toBe('function');
  });

  it('schema should enforce required fields', () => {
    const validReport = {
      executiveSummary: "Summary",
      insights: [{ title: "T", description: "D", category: "Performance" }],
      predictions: [{ metric: "M", predictedValue: "1", confidence: 90, reasoning: "R" }],
      recommendations: [{ action: "A", expectedImpact: "E", priority: "Low" }],
      alerts: [{ urgency: "Notice", message: "M", triggerCondition: "T" }]
    };
    
    expect(() => BusinessReportSchema.parse(validReport)).not.toThrow();
  });
});
