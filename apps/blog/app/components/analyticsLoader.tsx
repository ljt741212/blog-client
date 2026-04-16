'use client';
import { useEffect } from 'react';

import { behaviorMonitor } from 'behaviorMonitor';

import { heartbeat } from '@/lib/api';

export default function AnalyticsLoader() {
  useEffect(() => {
    const interval = setInterval(async () => {
       await heartbeat();
    }, 5000);
    behaviorMonitor.init({
      endpoint: 'http://localhost:3000/api/visitor/visit',
    });
    return () => clearInterval(interval);
  }, []);
  return null;
}
