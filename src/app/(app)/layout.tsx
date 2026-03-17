import { Sidebar } from '@/components/layout/sidebar/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { StoreInitializer } from '@/components/store-initializer';
import { ErrorBoundary } from '@/components/error-boundary';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--gs-bg)' }}
    >
      {/* Sidebar: hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-y-auto pb-16 md:pb-0 relative">
        {/* Subtle ambient glow */}
        <div
          className="fixed top-0 right-0 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: 'rgba(129,140,248,0.05)', zIndex: 0 }}
        />
        <div className="relative z-10">
          <StoreInitializer />
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </main>

      {/* Bottom nav: mobile only */}
      <MobileNav />
    </div>
  );
}
