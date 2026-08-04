import { EventEmitter } from 'events';

export interface AIEvent {
  type: string;
  payload: any;
  timestamp: Date;
}

class EventBus extends EventEmitter {
  constructor() {
    super();
  }

  public emitEvent(type: string, payload: any) {
    const event: AIEvent = {
      type,
      payload,
      timestamp: new Date()
    };
    this.emit(type, event);
  }
}

export const AIEventBus = new EventBus();
