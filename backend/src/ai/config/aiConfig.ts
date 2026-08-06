import dotenv from 'dotenv';
dotenv.config();

export const aiConfig = {
  provider: process.env.AI_DEFAULT_PROVIDER || 'huggingface', // 'groq' | 'huggingface'
  groq: {
    apiKey: process.env.GROQ_API_KEY || 'mock-key',
    defaultModel: process.env.GROQ_DEFAULT_MODEL || 'llama3-8b-8192',
  },
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY || 'mock-key',
    defaultModel: process.env.HUGGINGFACE_DEFAULT_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2',
  },
  temperature: Number(process.env.AI_TEMPERATURE) || 0,
  maxTokens: Number(process.env.AI_MAX_TOKENS) || 2048,
};
