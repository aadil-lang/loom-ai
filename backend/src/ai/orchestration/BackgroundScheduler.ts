import { AIEventBus } from './AIEventBus';
import logger from '../../utils/logger';

export class BackgroundScheduler {
  private static instance: BackgroundScheduler;
  private interval: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): BackgroundScheduler {
    if (!BackgroundScheduler.instance) {
      BackgroundScheduler.instance = new BackgroundScheduler();
    }
    return BackgroundScheduler.instance;
  }

  public start() {
    if (this.interval) return;

    logger.info('[AI Scheduler] Started');
    // Simulate a nightly job by firing every 24 hours (or much faster for testing)
    // For sprint testing, we'll just mock the behavior via an API trigger rather than waiting 24 hours.
    this.interval = setInterval(() => {
      logger.info('[AI Scheduler] Running nightly inventory check...');
      // In production, we'd fetch all supplier IDs and emit an event for each
      // AIEventBus.emitEvent('nightly_health_check', { time: new Date() });
    }, 24 * 60 * 60 * 1000);
  }

  public stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
