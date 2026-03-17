'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    console.error('[ErrorBoundary]', error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center px-8"
        >
          <p className="text-4xl">⚠️</p>
          <p className="font-bold text-lg" style={{ color: 'var(--gs-text)' }}>
            Something went wrong
          </p>
          <p className="text-sm" style={{ color: 'var(--gs-text-dim)' }}>
            {this.state.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, message: '' })}
            className="px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--gs-accent)', color: '#fff' }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
