import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  FileSpreadsheet,
  BookOpen,
  Users,
  MoreHorizontal,
  Award,
  Clock,
  Calculator,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';

interface MobileBottomNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenMore: () => void;
}

interface NavTabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isAction?: boolean;
  badge?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  onNavigate,
  onOpenMore,
}) => {
  const { currentUser, isAdmin } = useAuth();
  const { regrades } = useCourse();

  if (!currentUser) return null;

  const pendingAppealsCount = regrades.filter(r => r.status === 'pending').length;

  const adminTabs: NavTabItem[] = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'gradebook', label: 'Gradebook', icon: FileSpreadsheet },
    { id: 'builder', label: 'Assign', icon: BookOpen },
    {
      id: 'delegation',
      label: 'TA Team',
      icon: Users,
      badge: pendingAppealsCount > 0 ? pendingAppealsCount : undefined
    },
    { id: 'more', label: 'More', icon: MoreHorizontal, isAction: true },
  ];

  const studentTabs: NavTabItem[] = [
    { id: 'student-grades', label: 'Scores', icon: Award },
    { id: 'student-deadlines', label: 'Deadlines', icon: Clock },
    { id: 'student-whatif', label: 'What-If', icon: Calculator },
    { id: 'student-regrades', label: 'Appeals', icon: MessageSquare },
  ];

  const tabs = isAdmin ? adminTabs : studentTabs;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#000000]/95 backdrop-blur-lg border-t border-zinc-200 dark:border-[#27272A] shadow-lg pb-[env(safe-area-inset-bottom)] no-print transition-colors duration-150"
      aria-label="Mobile primary navigation"
    >
      <div className="flex items-center justify-around h-16 px-1 max-w-md mx-auto">
        {tabs.map(tab => {
          const isActive = !tab.isAction && activeView === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.isAction) {
                  onOpenMore();
                } else {
                  onNavigate(tab.id);
                }
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center flex-1 h-full min-h-[48px] py-1 transition-colors cursor-pointer ${
                isActive
                  ? 'text-[#3B82F6]'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-150 ${isActive ? 'scale-110' : ''}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold font-mono flex items-center justify-center ring-2 ring-white dark:ring-[#000000]">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-1 transition-font duration-150 ${
                isActive ? 'font-bold' : 'font-medium'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-active-indicator"
                  className="absolute top-0 w-8 h-0.5 rounded-full bg-[#3B82F6]"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
