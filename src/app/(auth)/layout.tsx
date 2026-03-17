import Link from 'next/link';

const HIGHLIGHTS = [
  { icon: '🎯', text: 'Set goals with deadlines and track every hour you put in.' },
  { icon: '📊', text: 'See your year at a glance with heatmaps and progress charts.' },
  { icon: '✍️', text: 'Journal your sessions and build a story around your growth.' },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--gs-bg)' }}>

      {/* ── Left brand panel ─────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 p-12 relative overflow-hidden"
        style={{ background: 'var(--gs-card)', borderRight: '1px solid var(--gs-border)' }}
      >
        {/* Glow orbs */}
        <div
          className="absolute top-[-80px] left-[-60px] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: 'rgba(129,140,248,0.15)' }}
        />
        <div
          className="absolute bottom-[-60px] right-[-40px] w-[300px] h-[300px] rounded-full blur-[90px] pointer-events-none"
          style={{ background: 'rgba(192,132,252,0.1)' }}
        />

        {/* Logo */}
        <Link href="/" className="relative z-10">
          <span className="font-black tracking-tight" style={{ fontSize: 20, letterSpacing: '-0.03em' }}>
            <span className="text-gradient-white">Goal </span>
            <span className="text-gradient-purple">Story</span>
          </span>
        </Link>

        {/* Middle content */}
        <div className="relative z-10 space-y-10">
          <div>
            <h2
              className="font-black tracking-tight leading-tight mb-3"
              style={{ fontSize: 36, letterSpacing: '-0.03em', color: 'var(--gs-text)' }}
            >
              Don&apos;t just set goals.
              <br />
              <span className="text-gradient">Prove you meant them.</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--gs-text-sub)' }}>
              Track time, build streaks, journal your journey — all in one place.
            </p>
          </div>

          <div className="space-y-4">
            {HIGHLIGHTS.map(({ icon, text }) => (
              <div key={icon} className="flex items-start gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-base"
                  style={{ background: 'var(--gs-accent-bg)', border: '1px solid var(--gs-accent-border)' }}
                >
                  {icon}
                </span>
                <p className="text-sm leading-snug pt-1" style={{ color: 'var(--gs-text-sub)' }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs relative z-10" style={{ color: 'var(--gs-text-dim)' }}>
          Free forever. No credit card required.
        </p>
      </div>

      {/* ── Right form panel ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Subtle bg glow */}
        <div
          className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: 'rgba(129,140,248,0.07)' }}
        />

        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <span className="font-black tracking-tight" style={{ fontSize: 22, letterSpacing: '-0.03em' }}>
            <span className="text-gradient-white">Goal </span>
            <span className="text-gradient-purple">Story</span>
          </span>
        </div>

        <div className="w-full max-w-sm relative z-10 animate-fade-in">
          <div
            className="rounded-2xl p-8 border"
            style={{
              background: 'var(--gs-card)',
              borderColor: 'var(--gs-border)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.1)',
            }}
          >
            {children}
          </div>
        </div>
      </div>

    </div>
  );
}
