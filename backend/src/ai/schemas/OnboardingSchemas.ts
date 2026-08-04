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
  companyName: z.string().optional(),
  contactName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  businessType: z.enum(['Manufacturer', 'Distributor', 'Wholesaler']).optional(),
  productCategories: z.array(z.string()).optional(),
  fabricTypes: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  country: z.string().optional(),
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
