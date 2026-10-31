import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useCourse } from '../../context/CourseContext';

export const OfflineBanner: React.FC = () => {
  const { isOnline, offlineQueueCount, lastSyncTimestamp } = useCourse();

  if (isOnline && offlineQueueCount === 0) {
    return null;
  }

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 dark:text-amber-200 px-4 py-2 text-xs font-medium flex items-center justify-between transition-colors">
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Offline Mode Active:</strong> You are viewing cached course records. Changes are safely saved locally and will auto-sync when your connection returns.
            </span>
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin shrink-0" />
            <span>
              <strong>Synchronizing:</strong> Uploading {offlineQueueCount} offline pending change{offlineQueueCount > 1 ? 's' : ''}...
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
        <span>Last synced: {new Date(lastSyncTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
      </div>
    </div>
  );
};
