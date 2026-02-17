'use client';
import { useEffect } from 'react';

import { behaviorMonitor } from 'behaviorMonitor';

export default function AnalyticsLoader() {
  useEffect(() => {
    behaviorMonitor.init({
      endpoint: 'http://localhost:3000/api/visitor/visit',
    });
  }, []);
  return null;
}
