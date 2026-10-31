import '@testing-library/jest-dom';

// Suppress benign animation cancellation in happy-dom test environment
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (
      event.reason?.name === 'AbortError' ||
      event.reason?.message?.includes('The animation was canceled')
    ) {
      event.preventDefault();
    }
  });
}

process.on('unhandledRejection', (reason: any) => {
  if (
    reason?.name === 'AbortError' ||
    reason?.message?.includes('The animation was canceled')
  ) {
    return;
  }
});

