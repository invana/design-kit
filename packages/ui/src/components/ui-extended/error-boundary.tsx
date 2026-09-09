import { Frown } from 'lucide-react';
import { Component, ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
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


