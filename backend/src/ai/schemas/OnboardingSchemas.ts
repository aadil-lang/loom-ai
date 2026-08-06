import { z } from 'zod';
import { BaseAgentState } from './GraphState';
import { BaseMessage } from '@langchain/core/messages';

export enum OnboardingStage {
  WELCOME = 'WELCOME',
  COLLECTION = 'COLLECTION',
  VALIDATION = 'VALIDATION',
  CONFIRMATION = 'CONFIRMATION',
  COMPLETED = 'COMPLETED'
}

export const SupplierOnboardingDataSchema = z.object({
  companyDescription: z.string().optional().describe('A brief description of the company and its history.'),
  businessType: z.enum(['Manufacturer', 'Distributor', 'Wholesaler']).optional(),
  productCategories: z.array(z.string()).optional(),
  capabilities: z.array(z.string()).optional().describe('Manufacturing capabilities or specialties, e.g. Weaving, Dyeing.'),
  certifications: z.array(z.string()).optional().describe('Any industry certifications like ISO, GOTS.'),
  operatingRegions: z.array(z.string()).optional().describe('Regions where the supplier operates or ships to.'),
  businessHours: z.string().optional().describe('Standard operating hours.'),
  preferredLanguage: z.string().optional()
});

export type SupplierOnboardingData = z.infer<typeof SupplierOnboardingDataSchema>;

export interface SupplierOnboardingState extends BaseAgentState {
  sessionId: string;
  language: string;
  progress: number;
  missingFields: string[];
  collectedData: SupplierOnboardingData;
  currentStage: OnboardingStage;
}

export const ExtractedDataSchema = z.object({
  extractedData: SupplierOnboardingDataSchema,
  detectedLanguage: z.string().optional().describe('ISO 639-1 code if detected, e.g. en, es, fr, zh')
});
