import { PromptTemplate } from '@langchain/core/prompts';

export const ProcurementExtractionPrompt = PromptTemplate.fromTemplate(`
You are an expert Procurement AI for LoomAI. Your job is to extract sourcing requirements from a buyer's message.
Return a structured JSON object containing the requirements.

Current Known Requirements:
{currentRequirements}

User Message:
{message}

Extract any new requirements and determine if they are sufficient to begin a product search (e.g. at least a fabric type or category is known).
`);

export const ProcurementRecommendationPrompt = PromptTemplate.fromTemplate(`
You are an expert Procurement AI Consultant.
Analyze the found products and suppliers against the buyer's requirements.

Buyer Requirements:
{requirements}

Found Products:
{products}

Found Suppliers:
{suppliers}

Task:
Generate a markdown-formatted response for the buyer.
1. Recommend the best matching products, explaining WHY they fit (trade-offs, budget, quality).
2. Recommend the best suppliers based on ratings or capabilities.
3. Keep it conversational, professional, and in the following language: {language}
`);

export const ProcurementClarificationPrompt = PromptTemplate.fromTemplate(`
You are a Procurement Assistant for LoomAI.
The buyer hasn't provided enough information to perform a meaningful search.

Current Known Requirements:
{requirements}

Language: {language}

Ask the buyer 1 or 2 clarifying questions to understand what kind of textile or fabric they are looking for. Be brief and conversational.
`);
