import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ErrorBoundary } from './ErrorBoundary';
import { vi } from 'vitest';

const ProblemChild = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  const originalConsoleWarn = console.warn;
  
  beforeAll(() => {
    console.warn = vi.fn();
  });
  
  afterAll(() => {
    console.warn = originalConsoleWarn;
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child component</div>
      </ErrorBoundary>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders error UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/A temporary display exception occurred/i)).toBeInTheDocument();
  });

  it('reloads window when button is clicked', () => {
    // Mock window.location.reload
    const originalLocation = window.location;
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { ...originalLocation, reload: vi.fn() };
    
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    
    const reloadBtn = screen.getByText('Reload GradeFlow');
    fireEvent.click(reloadBtn);
    
    expect(window.location.reload).toHaveBeenCalled();
    
    // Restore window.location
    // @ts-ignore
    window.location = originalLocation;
  });
});
