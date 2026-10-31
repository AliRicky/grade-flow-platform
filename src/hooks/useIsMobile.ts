import { useState, useEffect } from 'react';

/**
 * Custom hook to detect mobile viewport (< breakpoint px).
 * Defaults to 768px (standard Tailwind md: breakpoint).
 * SSR-safe and dynamically updates on screen resize or orientation change.
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const updateMatch = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Synchronize initial state
    updateMatch();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMatch);
    } else {
      // Fallback for older Safari
      mediaQuery.addListener(updateMatch);
    }

    window.addEventListener('resize', updateMatch);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateMatch);
      } else {
        mediaQuery.removeListener(updateMatch);
      }
      window.removeEventListener('resize', updateMatch);
    };
  }, [breakpoint]);

  return isMobile;
}
