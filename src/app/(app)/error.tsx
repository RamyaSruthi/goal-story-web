'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: 'var(--gs-bg)' }}
    >
      <p className="text-7xl mb-6">⚡</p>
      <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--gs-text)' }}>
        Something went wrong
      </h2>
      <p className="text-sm mb-8 max-w-sm" style={{ color: 'var(--gs-text-dim)' }}>
        An unexpected error occurred. Your data is safe — try refreshing the page.
      </p>
      <button
        onClick={reset}
        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
        style={{ background: 'var(--gs-accent)' }}
      >
        Try again
      </button>
    </div>
  );
}
