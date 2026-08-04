import dotenv from 'dotenv';
dotenv.config();

export const aiConfig = {
  provider: process.env.AI_DEFAULT_PROVIDER || 'groq', // 'groq' | 'huggingface'
  groq: {
    apiKey: process.env.GROQ_API_KEY || '',
    defaultModel: process.env.GROQ_DEFAULT_MODEL || 'llama3-8b-8192',
  },
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY || '',
    defaultModel: process.env.HUGGINGFACE_DEFAULT_MODEL || 'meta-llama/Llama-2-7b-chat-hf',
  },
  temperature: Number(process.env.AI_TEMPERATURE) || 0,
  maxTokens: Number(process.env.AI_MAX_TOKENS) || 2048,
};
