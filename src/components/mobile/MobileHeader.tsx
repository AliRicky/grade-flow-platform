import React from 'react';
import {
  Sun,
  Moon,
  Bell,
  Layers,
  LogIn,
  Wifi,
  WifiOff,
  Shield,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';
import { useTheme } from '../../context/ThemeContext';

interface MobileHeaderProps {
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onOpenNotifications,
  onOpenAuth,
}) => {
  const { currentUser, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, isOnline } = useCourse();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#000000]/95 backdrop-blur-md border-b border-zinc-200 dark:border-[#27272A] transition-colors duration-150 no-print">
      <div className="px-4 h-14 flex items-center justify-between gap-2">
        {/* Brand & Role Badge */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#1f9d68] flex items-center justify-center text-black shadow-xs shrink-0">
            <Layers className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-display leading-none">
              GradeFlow
            </span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5 leading-none">
              {currentUser ? (
                <>
                  {isAdmin ? (
                    <span className="text-[#3B82F6] font-semibold flex items-center gap-0.5">
                      <Shield className="w-2.5 h-2.5" /> Staff
                    </span>
                  ) : (
                    <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                      <GraduationCap className="w-2.5 h-2.5" /> Student
                    </span>
                  )}
                  <span>· {currentUser.full_name.split(' ')[0]}</span>
                </>
              ) : (
                <span className="text-zinc-400">Guest</span>
              )}
            </span>
          </div>
        </div>

        {/* Action Buttons (Strict minimum 44x44px touch targets) */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Offline/Online Indicator */}
          <div
            className="w-10 h-10 flex items-center justify-center text-zinc-500"
            title={isOnline ? 'Online' : 'Offline: Local changes cached'}
            aria-label={isOnline ? 'Online' : 'Offline'}
          >
            {isOnline ? (
              <Wifi className="w-4 h-4 text-[#3B82F6]" />
            ) : (
              <WifiOff className="w-4 h-4 text-amber-500" />
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Notification Bell */}
          {currentUser && (
            <button
              onClick={onOpenNotifications}
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#3B82F6] text-black text-[9px] font-bold font-mono flex items-center justify-center ring-2 ring-white dark:ring-[#000000]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile / Sign In */}
          {currentUser ? (
            <button
              onClick={onOpenAuth}
              aria-label="Account settings"
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#3B82F6]/15 flex items-center justify-center border border-[#3B82F6]/30">
                <span className="text-[10px] font-bold text-[#3B82F6] font-mono">
                  {(currentUser?.full_name || 'U')
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1 h-9 px-3 text-xs font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
