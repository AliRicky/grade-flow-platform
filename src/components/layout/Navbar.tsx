import React from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Bell,
  Shield,
  GraduationCap,
  Wifi,
  WifiOff,
  Download,
  FileSpreadsheet,
  Layers,
  LogOut,
  LogIn,
  Database,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  onOpenExportHub?: () => void;
  onOpenGoogleSheetsModal?: () => void;
}

const ADMIN_NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'gradebook', label: 'Gradebook' },
  { id: 'semester-report', label: 'Semester Report' },
  { id: 'builder', label: 'Assignments' },
  { id: 'delegation', label: 'TA Team' },
  { id: 'overdue', label: 'Reminders' },
  { id: 'user-management', label: 'Users' },
];

const STUDENT_NAV = [
  { id: 'student-grades', label: 'My Scores' },
  { id: 'student-deadlines', label: 'Deadlines' },
  { id: 'student-whatif', label: 'What-If' },
  { id: 'student-regrades', label: 'Appeals' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  onOpenNotifications,
  onOpenAuth,
  onOpenExportHub,
  onOpenGoogleSheetsModal,
}) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, isOnline } = useCourse();

  const unreadCount = notifications.filter(n => !n.read).length;
  const links = currentUser ? (isAdmin ? ADMIN_NAV : STUDENT_NAV) : [];


  const iconBtn =
    'relative p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150 cursor-pointer';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#000000]/90 backdrop-blur-md border-b border-zinc-200 dark:border-[#27272A] transition-colors duration-150 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => onNavigate(isAdmin ? 'overview' : 'student-grades')}
          className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
          aria-label="GradeFlow home"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#1f9d68] flex items-center justify-center text-black shadow-sm shadow-[#3B82F6]/20 group-hover:shadow-[#3B82F6]/40 transition-shadow">
            <Layers className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-display">
              GradeFlow
            </span>
          </div>
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium h-full" aria-label="Primary">
          {links.map(link => {
            const isActive = activeView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative h-full px-3 whitespace-nowrap cursor-pointer transition-colors duration-150 ${
                  isActive
                    ? 'text-zinc-900 dark:text-white font-semibold'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    className="absolute left-3 right-3 -bottom-px h-0.5 rounded-full bg-[#3B82F6]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {isAdmin && onOpenGoogleSheetsModal && (
            <button
              onClick={onOpenGoogleSheetsModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#3B82F6] bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 border border-[#3B82F6]/30 rounded-lg transition-colors duration-150 cursor-pointer"
              title="Manage Supabase Database"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Supabase</span>
            </button>
          )}

          {isAdmin && onOpenExportHub && (
            <button
              onClick={() => onOpenExportHub()}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-100 bg-white dark:bg-[#09090B] hover:bg-zinc-50 dark:hover:bg-[#222222] border border-zinc-300 dark:border-[#2e2e2e] rounded-lg transition-colors duration-150 cursor-pointer"
              title="Export gradebook or assignment reports (PDF & CSV)"
            >
              <Download className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span className="hidden lg:inline">Export</span>
            </button>
          )}

          <div
            className="p-2"
            title={isOnline ? 'Connected' : 'Offline: local changes are cached'}
            aria-label={isOnline ? 'Online' : 'Offline'}
          >
            {isOnline ? <Wifi className="w-4 h-4 text-[#3B82F6]" /> : <WifiOff className="w-4 h-4 text-amber-500" />}
          </div>

          <button onClick={toggleTheme} className={iconBtn} aria-label="Toggle theme" title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {currentUser && (
            <button onClick={onOpenNotifications} className={iconBtn} aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}>
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#3B82F6] text-black text-[10px] font-bold font-mono flex items-center justify-center ring-2 ring-white dark:ring-[#000000]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}

          {currentUser ? (
            <div className="flex items-center gap-1 pl-2 ml-1 border-l border-zinc-200 dark:border-zinc-800">
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 py-1 px-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors duration-150 cursor-pointer"
                title="Switch account"
              >
                <div className="w-7 h-7 rounded-full bg-[#3B82F6]/15 flex items-center justify-center border border-[#3B82F6]/30 shrink-0">
                  <span className="text-[10px] font-bold text-[#3B82F6] font-mono">
                    {(currentUser?.full_name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="hidden lg:block">
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-none mb-0.5">Welcome back,</div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight truncate max-w-[150px]">
                    {currentUser?.full_name?.split(' ')[0] || 'Unknown'}
                  </div>
                </div>
              </button>
              <button onClick={logout} className={iconBtn} aria-label="Sign out" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 py-1.5 px-3 ml-1 text-xs font-semibold text-black bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg transition-colors duration-150 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      {links.length > 0 && (
        <nav className="md:hidden border-t border-zinc-100 dark:border-zinc-800/80 px-3 overflow-x-auto" aria-label="Primary mobile">
          <div className="flex items-center gap-1 text-xs min-w-max py-1.5">
            {links.map(link => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#3B82F6]/15 text-[#3B82F6] font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            {isAdmin && onOpenExportHub && (
              <button
                onClick={() => onOpenExportHub()}
                className="sm:hidden px-3 py-1.5 rounded-lg font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Export
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};
