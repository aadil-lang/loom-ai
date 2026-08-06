import { createLogger, format, transports } from 'winston';

export const aiLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  defaultMeta: { service: 'ai-module' },
  transports: [
    new transports.File({ filename: 'logs/ai-error.log', level: 'error' }),
    new transports.File({ filename: 'logs/ai-metrics.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  aiLogger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    ),
  }));
} else {
  aiLogger.add(new transports.Console({
    format: format.combine(
      format.timestamp(),
      format.json()
    ),
  }));
}

export function logAgentEvent(
  agentName: string,
  modelUsed: string,
  provider: string,
  tokens: { prompt: number, completion: number },
  latencyMs: number,
  errors?: any
) {
  const logData = {
    agentName,
    modelUsed,
    provider,
    tokens,
    totalTokens: tokens.prompt + tokens.completion,
    latencyMs,
    ...(errors && { errors })
  };

  if (errors) {
    aiLogger.error('AI Agent Error', logData);
  } else {
    aiLogger.info('AI Agent Success', logData);
  }
}
