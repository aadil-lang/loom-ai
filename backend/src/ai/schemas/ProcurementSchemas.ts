import { z } from 'zod';
import { BaseAgentState } from './GraphState';

export const ProcurementRequirementsSchema = z.object({
  category: z.string().optional().describe('General product category, e.g., Fabrics, Yarns'),
  fabricType: z.string().optional().describe('Specific material type, e.g., Cotton, Silk, Denim'),
  quantity: z.number().optional().describe('Total amount needed in meters/kg'),
  maxPrice: z.number().optional().describe('Maximum budget per unit in local currency'),
  deliveryDays: z.number().optional().describe('Maximum acceptable delivery time in days'),
  sustainability: z.string().optional().describe('Sustainability requirements like Organic, Recycled'),
  purpose: z.string().optional().describe('The intended use case, e.g., School Uniforms, Hotel Curtains')
});

export type ProcurementRequirements = z.infer<typeof ProcurementRequirementsSchema>;

export const ExtractedRequirementsSchema = z.object({
  extractedRequirements: ProcurementRequirementsSchema,
  detectedLanguage: z.string().optional().describe('ISO 639-1 code if detected, e.g. en, es, fr, zh'),
  isSufficient: z.boolean().describe('True if enough information is gathered to perform a meaningful search')
});

export interface ProcurementState extends BaseAgentState {
  sessionId: string;
  language: string;
  requirements: ProcurementRequirements;
  foundProducts: any[];
  foundSuppliers: any[];
  recommendationSummary: string | null;
}
