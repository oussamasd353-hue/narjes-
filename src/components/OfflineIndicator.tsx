import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 z-40 mx-auto max-w-sm flex items-center justify-center sm:justify-start gap-2 rounded-2xl border border-violet-300/70 bg-violet-900/95 px-4 py-2.5 text-xs font-medium text-violet-50 shadow-lg backdrop-blur-md dark:border-violet-700/70 dark:bg-[#2B213B]/95"
    >
      <WifiOff className="h-4 w-4 shrink-0 text-violet-300" aria-hidden="true" />
      <span>أنتِ غير متصلة بالإنترنت — بياناتكِ محفوظة بأمان على جهازكِ</span>
    </div>
  );
};
