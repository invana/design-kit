import { Frown } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * Called once for each error the boundary catches, with React's component
   * stack — where an app reports the error (a log, a counter). The boundary
   * still shows its fallback; this only observes.
   */
  onError?: (error: Error, info: ErrorInfo) => void;
  /** What to show instead of the children once they have thrown. Defaults to a short notice. */
  fallback?: ReactNode;
}

/**
 * Catches a render error in its children and shows a fallback in their place,
 * so one broken region does not blank the whole screen.
 *
 * Usage:
 *
 * ```tsx
 * <ErrorBoundary onError={(error) => report(error)}>
 *   <Region />
 * </ErrorBoundary>
 * ```
 *
 * `onError` is how an app learns what broke; without it the error goes to the
 * console only.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="inline-flex items-center">
            <Frown className="mr-1 h-4" />
            Oops ! something went wrong.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
