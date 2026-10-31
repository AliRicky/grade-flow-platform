/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CourseProvider, useCourse } from './context/CourseContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { OfflineBanner } from './components/common/OfflineBanner';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { useIsMobile } from './hooks/useIsMobile';
import { MobileHeader } from './components/mobile/MobileHeader';
import { MobileBottomNav } from './components/mobile/MobileBottomNav';
import { MobileMoreSheet } from './components/mobile/MobileMoreSheet';

// Code-split Lazy-loaded Admin Components
const DashboardOverview = lazy(() => import('./components/admin/DashboardOverview').then(m => ({ default: m.DashboardOverview })));
const GradebookMatrix = lazy(() => import('./components/admin/GradebookMatrix').then(m => ({ default: m.GradebookMatrix })));
const MobileGradebook = lazy(() => import('./components/mobile/MobileGradebook').then(m => ({ default: m.MobileGradebook })));
const AssignmentBuilder = lazy(() => import('./components/admin/AssignmentBuilder').then(m => ({ default: m.AssignmentBuilder })));
const OverdueNotifierModal = lazy(() => import('./components/admin/OverdueNotifierModal').then(m => ({ default: m.OverdueNotifierModal })));
const ExportCenterModal = lazy(() => import('./components/admin/ExportCenterModal').then(m => ({ default: m.ExportCenterModal })));
const SupabaseDatabaseModal = lazy(() => import('./components/admin/SupabaseDatabaseModal').then(m => ({ default: m.SupabaseDatabaseModal })));
const UserManagement = lazy(() => import('./components/admin/UserManagement').then(m => ({ default: m.UserManagement })));
const TaDelegationPanel = lazy(() => import('./components/admin/TaDelegationPanel').then(m => ({ default: m.TaDelegationPanel })));

// Code-split Lazy-loaded Student Components
const StudentGradesView = lazy(() => import('./components/student/StudentGradesView').then(m => ({ default: m.StudentGradesView })));
const StudentDeadlinesView = lazy(() => import('./components/student/StudentDeadlinesView').then(m => ({ default: m.StudentDeadlinesView })));
const WhatIfCalculator = lazy(() => import('./components/student/WhatIfCalculator').then(m => ({ default: m.WhatIfCalculator })));
const StudentRegradesView = lazy(() => import('./components/student/StudentRegradesView').then(m => ({ default: m.StudentRegradesView })));
const RegradeModal = lazy(() => import('./components/student/RegradeModal').then(m => ({ default: m.RegradeModal })));

const SuspenseLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[360px] text-zinc-400">
    <div className="w-6 h-6 border-2 border-zinc-200 dark:border-zinc-800 border-t-[#3B82F6] rounded-full animate-spin" />
  </div>
);

import { Assignment } from './types';
import { DEFAULT_GRADING_SCALE } from './utils/grading';
import { Shield, GraduationCap, ArrowLeftRight, Send, LogIn, Layers } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const { gradingScale: rawScale } = useCourse();
  const gradingScale = rawScale || DEFAULT_GRADING_SCALE;
  const isMobile = useIsMobile();
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  // Navigation State
  const [activeView, setActiveView] = useState<string>(() => {
    return isAdmin ? 'overview' : 'student-grades';
  });

  const [builderAssignmentId, setBuilderAssignmentId] = useState<string | undefined>(undefined);
  const [gradebookAssignmentId, setGradebookAssignmentId] = useState<string | undefined>(undefined);
  
  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isOverdueModalOpen, setIsOverdueModalOpen] = useState(false);
  const [overdueTargetAsgId, setOverdueTargetAsgId] = useState<string | undefined>(undefined);
  const [isExportHubOpen, setIsExportHubOpen] = useState(false);
  const [exportTargetAsgId, setExportTargetAsgId] = useState<string | undefined>(undefined);
  const [isGoogleSheetsModalOpen, setIsGoogleSheetsModalOpen] = useState(false);

  // Regrade Appeal Modal State (Student)
  const [regradeModalData, setRegradeModalData] = useState<{
    isOpen: boolean;
    assignment: Assignment | null;
    questionLabel: string;
    currentScore: number;
    maxScore: number;
  }>({
    isOpen: false,
    assignment: null,
    questionLabel: '',
    currentScore: 0,
    maxScore: 0,
  });

  // Keep the active view valid for the current role (and reset after sign-out / switch)
  const adminViews = ['overview', 'gradebook', 'builder', 'delegation', 'overdue', 'user-management'];
  const studentViews = ['student-grades', 'student-deadlines', 'student-whatif', 'student-regrades'];
  React.useEffect(() => {
    if (isAdmin && !adminViews.includes(activeView)) setActiveView('overview');
    if (currentUser && !isAdmin && !studentViews.includes(activeView)) setActiveView('student-grades');
  }, [isAdmin, currentUser, activeView]);

  const handleNavigate = (view: string, asgId?: string) => {
    // Always set (or clear) the target so stale ids never leak between visits
    if (view === 'builder') setBuilderAssignmentId(asgId);
    if (view === 'gradebook') setGradebookAssignmentId(asgId);
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOverdue = (asgId?: string) => {
    setOverdueTargetAsgId(asgId);
    setIsOverdueModalOpen(true);
  };

  const handleOpenExportHub = (asgId?: string) => {
    setExportTargetAsgId(asgId);
    setIsExportHubOpen(true);
  };

  const handleRequestRegrade = (
    assignment: Assignment,
    questionLabel: string,
    currentScore: number,
    maxScore: number
  ) => {
    setRegradeModalData({
      isOpen: true,
      assignment,
      questionLabel,
      currentScore,
      maxScore,
    });
  };


  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#FAFAFA] dark:bg-[#000000] text-zinc-900 dark:text-[#ededed] flex flex-col font-sans transition-colors duration-150 overflow-x-clip pt-[env(safe-area-inset-top)]">
      {/* Role context bar + quick role switcher (demo helper) */}
      <div className="bg-[#09090B] text-white text-xs py-1.5 px-4 flex items-center justify-between gap-3 border-b border-zinc-800 no-print">
        <div className="flex items-center gap-2 min-w-0">
          {currentUser ? (
            <>
              <span className={`inline-flex items-center gap-1.5 font-semibold shrink-0 ${isAdmin ? 'text-[#3B82F6]' : 'text-amber-400'}`}>
                {isAdmin ? <Shield className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
                <span>{isAdmin ? 'Teaching Staff view' : 'Student portal'}</span>
              </span>
              <span className="text-zinc-500 hidden sm:inline truncate">· Signed in as {currentUser.full_name}</span>
            </>
          ) : (
            <span className="text-zinc-400">You are signed out</span>
          )}
        </div>

      </div>

      {/* Offline sync alert banner if disconnected */}
      <OfflineBanner />

      {/* 3-Zone Top Navigation Bar (Desktop) vs Mobile Header */}
      {isMobile ? (
        <MobileHeader
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      ) : (
        <Navbar
          activeView={activeView}
          onNavigate={handleNavigate}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenExportHub={handleOpenExportHub}
          onOpenGoogleSheetsModal={() => setIsGoogleSheetsModalOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 max-w-7xl w-full mx-auto px-3.5 py-4 sm:p-6 lg:p-8 overflow-x-clip ${isMobile ? 'pb-[calc(6rem+env(safe-area-inset-bottom))]' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentUser ? `${currentUser.id}-${activeView}` : 'anon'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <Suspense fallback={<SuspenseLoader />}>
            {!currentUser ? (
          <div className="max-w-md mx-auto mt-16 text-center bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 shadow-xs relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none" style={{ backgroundImage: "url('/assets/haikei-blob.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="relative z-10">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#93C5FD] flex items-center justify-center text-white mb-5 shadow-sm">
                <Layers className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <h1 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100">Welcome to GradeFlow</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                Sign in to view grades and deadlines, or manage assessments as teaching staff.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign in</span>
              </button>
            </div>
          </div>
        ) : isAdmin ? (
          /* Admin / TA Views */
          <>
            {activeView === 'overview' && (
              <DashboardOverview
                onNavigate={handleNavigate}
                onOpenOverdueModal={handleOpenOverdue}
                onOpenExportHub={handleOpenExportHub}
                onOpenGoogleSheetsModal={() => setIsGoogleSheetsModalOpen(true)}
              />
            )}

            {activeView === 'gradebook' && (
              isMobile ? (
                <MobileGradebook
                  key={gradebookAssignmentId ?? 'mobile-default'}
                  initialAssignmentId={gradebookAssignmentId}
                  onNavigateToBuilder={(asgId) => handleNavigate('builder', asgId)}
                  onOpenExportHub={handleOpenExportHub}
                  onOpenGoogleSheetsModal={() => setIsGoogleSheetsModalOpen(true)}
                />
              ) : (
                <GradebookMatrix
                  key={gradebookAssignmentId ?? 'default'}
                  initialAssignmentId={gradebookAssignmentId}
                  onNavigateToBuilder={(asgId) => handleNavigate('builder', asgId)}
                  onOpenExportHub={handleOpenExportHub}
                  onOpenGoogleSheetsModal={() => setIsGoogleSheetsModalOpen(true)}
                />
              )
            )}

            {activeView === 'builder' && (
              <AssignmentBuilder
                key={builderAssignmentId ?? 'default'}
                initialAssignmentId={builderAssignmentId}
                onSaved={() => {}}
              />
            )}

            {activeView === 'delegation' && (
              <TaDelegationPanel />
            )}

            {activeView === 'overdue' && (
              <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold font-display text-zinc-900 dark:text-zinc-100">
                      Reminders & Overdue Dispatcher
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 max-w-lg">
                      Email students who have no recorded submission for an assessment.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenOverdue()}
                  className="px-4 py-2 text-xs font-semibold text-black bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Launch notification wizard
                </button>
              </div>
            )}
            
            {activeView === 'user-management' && (
              <UserManagement />
            )}
          </>
        ) : (
          /* Student Views */
          <>
            {activeView === 'student-grades' && (
              <StudentGradesView onRequestRegrade={handleRequestRegrade} />
            )}

            {activeView === 'student-deadlines' && (
              <StudentDeadlinesView />
            )}

            {activeView === 'student-whatif' && (
              <WhatIfCalculator />
            )}

            {activeView === 'student-regrades' && (
              <StudentRegradesView />
            )}
          </>
        )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800/80 py-5 px-4 sm:px-6 text-xs text-zinc-500 dark:text-zinc-400 no-print hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GradeFlow</span>
          <span className="font-mono text-[11px]">{gradingScale.label || `Numeric ${gradingScale.max_score}-point grading scale`}</span>
        </div>
      </footer>

      {/* Mobile Bottom Navigation & Action Sheets */}
      {isMobile && (
        <>
          <MobileBottomNav
            activeView={activeView}
            onNavigate={handleNavigate}
            onOpenMore={() => setIsMobileMoreOpen(true)}
          />
          <MobileMoreSheet
            isOpen={isMobileMoreOpen}
            onClose={() => setIsMobileMoreOpen(false)}
            onNavigate={handleNavigate}
            onOpenExportHub={handleOpenExportHub}
            onOpenGoogleSheetsModal={() => setIsGoogleSheetsModalOpen(true)}
            onOpenOverdue={handleOpenOverdue}
          />
        </>
      )}

      {/* Global Modals & Drawers */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      <Suspense fallback={null}>
        <OverdueNotifierModal
          isOpen={isOverdueModalOpen}
          defaultAssignmentId={overdueTargetAsgId}
          onClose={() => setIsOverdueModalOpen(false)}
        />

        <ExportCenterModal
          isOpen={isExportHubOpen}
          onClose={() => setIsExportHubOpen(false)}
          defaultAssignmentId={exportTargetAsgId}
        />

        {isGoogleSheetsModalOpen && (
          <SupabaseDatabaseModal
            isOpen={isGoogleSheetsModalOpen}
            onClose={() => setIsGoogleSheetsModalOpen(false)}
          />
        )}

        <RegradeModal
          isOpen={regradeModalData.isOpen}
          assignment={regradeModalData.assignment}
          questionLabel={regradeModalData.questionLabel}
          currentScore={regradeModalData.currentScore}
          maxScore={regradeModalData.maxScore}
          onClose={() => setRegradeModalData(prev => ({ ...prev, isOpen: false }))}
        />
      </Suspense>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CourseProvider>
          <MainLayout />
        </CourseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
