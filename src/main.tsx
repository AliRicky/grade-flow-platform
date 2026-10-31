import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';

// Global protection against third-party cross-origin iframe security errors and re-entrancy
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event: ErrorEvent) => {
    const msg = event.message || '';
    if (
      msg.includes('Blocked a frame with origin') ||
      msg.includes('cross-origin frame') ||
      msg.includes('Should not already be working') ||
      event.error?.name === 'SecurityError'
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return true;
    }
  }, true);

  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    const msg = typeof reason === 'string' ? reason : (reason?.message || '');
    if (
      msg.includes('Blocked a frame with origin') ||
      msg.includes('cross-origin frame') ||
      msg.includes('popup-closed-by-user') ||
      msg.includes('cancelled-popup-request') ||
      msg.includes('popup-blocked') ||
      reason?.name === 'SecurityError'
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
