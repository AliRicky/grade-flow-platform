import React, { useEffect, useState } from 'react';
import { X, Bell, Check, Clock, Award, MessageSquare, AlertCircle } from 'lucide-react';
import { useCourse } from '../../context/CourseContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, triggerBrowserNotification } = useCourse();
  const [filter, setFilter] = useState<'all' | 'deadline' | 'grade' | 'regrade'>('all');
  const [browserNotifEnabled, setBrowserNotifEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission === 'granted';
    }
    return false;
  });

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (n.read) return false;
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleEnableBrowserNotifications = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setBrowserNotifEnabled(true);
          triggerBrowserNotification('GradeFlow Notifications Active', 'You will receive reminders for upcoming course deadlines.');
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <Clock className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'grade':
        return <Award className="w-4 h-4 text-[#3B82F6] shrink-0" />;
      case 'regrade':
        return <MessageSquare className="w-4 h-4 text-sky-500 shrink-0" />;
      default:
        return <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Notifications"
    >
      <div className="w-full max-w-md bg-white dark:bg-[#09090B] shadow-2xl h-full flex flex-col border-l border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#3B82F6]" />
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Notifications</h2>
            {unreadCount > 0 && (
              <span className="text-xs font-mono font-medium text-[#3B82F6] ml-1 bg-[#3B82F6]/10 px-1.5 py-0.5 rounded">
                ({unreadCount} new)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close notifications"
              className="p-1 cursor-pointer rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Browser notification prompt banner if not enabled */}
        {!browserNotifEnabled && (
          <div className="bg-[#3B82F6]/10 border-b border-[#3B82F6]/20 p-3 flex items-center justify-between gap-3 text-xs">
            <span className="text-zinc-900 dark:text-zinc-200">
              Get desktop alerts for homework due dates & exam schedules.
            </span>
            <button
              onClick={handleEnableBrowserNotifications}
              className="px-2.5 py-1 text-xs font-medium text-black bg-[#3B82F6] hover:bg-[#2563EB] rounded transition-colors whitespace-nowrap font-semibold"
            >
              Enable
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-[#141414]">
          {(['all', 'deadline', 'grade', 'regrade'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 text-xs font-medium rounded capitalize transition-colors ${
                filter === tab
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/60 dark:border-zinc-700'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              {tab === 'all' ? 'All' : tab === 'deadline' ? 'Deadlines' : tab === 'grade' ? 'Grades' : 'Appeals'}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/80">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-zinc-400 dark:text-zinc-500 text-sm">
              No notifications in this category.
            </div>
          ) : (
            filteredNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-4 flex gap-3 cursor-pointer transition-colors ${
                  notif.read
                    ? 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 opacity-80'
                    : 'bg-[#3B82F6]/5 hover:bg-[#3B82F6]/10 dark:bg-[#3B82F6]/10 dark:hover:bg-[#3B82F6]/15'
                }`}
              >
                <div className="mt-0.5">{getIcon(notif.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {notif.title}
                    </h4>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500 shrink-0 font-mono">
                      {new Date(notif.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] self-center shrink-0" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
