import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: 'var(--gs-bg)' }}
    >
      <p className="text-7xl mb-6">🗺️</p>
      <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--gs-text)' }}>
        Page not found
      </h1>
      <p className="text-base mb-8 max-w-sm" style={{ color: 'var(--gs-text-dim)' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/app/today"
        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
        style={{ background: 'var(--gs-accent)' }}
      >
        Back to app
      </Link>
    </div>
  );
}
