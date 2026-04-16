import { useEffect, useState, useRef } from 'react';

import { createPortal } from 'react-dom';
import './loading.css';

interface FullScreenLoadingProps {
  loading: boolean;
  delay?: number;
}

const BODY_SCROLL_LOCK_CLASS = 'loading-open';

export default function FullScreenLoading({ loading, delay = 750 }: FullScreenLoadingProps) {
  const [showLoading, setShowLoading] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (loading) {
      setShowLoading(true);
      startTimeRef.current = Date.now();
    } else {
      if (startTimeRef.current !== null) {
        const elapsed = Date.now() - startTimeRef.current;
        const remaining = Math.max(0, delay - elapsed);
        const timer = setTimeout(() => {
          setShowLoading(false);
          startTimeRef.current = null;
        }, remaining);
        return () => clearTimeout(timer);
      } else {
        setShowLoading(false);
      }
    }
  }, [loading, delay]);

  useEffect(() => {
    if (showLoading) {
      document.body.classList.add(BODY_SCROLL_LOCK_CLASS);
      document.documentElement.classList.add(BODY_SCROLL_LOCK_CLASS);
    } else {
      document.body.classList.remove(BODY_SCROLL_LOCK_CLASS);
      document.documentElement.classList.remove(BODY_SCROLL_LOCK_CLASS);
    }
    return () => {
      document.body.classList.remove(BODY_SCROLL_LOCK_CLASS);
      document.documentElement.classList.remove(BODY_SCROLL_LOCK_CLASS);
    };
  }, [showLoading]);

  if (!showLoading) return null;

  return createPortal(
    <div className="loading-overlay fixed inset-0 z-[9999] flex justify-center items-center">
      <div className="loading-stage">
        <div className="loading-ring-outer" />
        <div className="loading-ring-inner" />
        <div className="loading-core" />
      </div>
    </div>,
    document.body
  );
}
