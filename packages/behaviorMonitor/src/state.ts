import type { BehaviorMonitorConfig } from './types';

interface InternalState {
  config?: BehaviorMonitorConfig;
  sessionStartTime?: number;
  visitorId?: string;
  initialized: boolean;
}

export const state: InternalState = {
  initialized: false,
};

export const VISITOR_ID_KEY = 'behaviorMonitor_visitor_id';
