import Link from 'next/link';
import { ArrowRight, Target, PenLine, TrendingUp } from 'lucide-react';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { AnimatedWeekBarMockup } from '@/components/landing/animated-week-bar-mockup';
import { AnimatedBentoVisual } from '@/components/landing/animated-bento-visuals';
import { AnimatedTarget } from '@/components/landing/animated-target';
import { ThemeSwitch } from '@/components/landing/theme-switch';


const FEATURES = [
  {
    key: 'heat',
    span: 'lg:col-span-2',
    accent: '#818CF8',
    title: 'Consistency at a glance',
    desc: 'A full-year heatmap shows exactly when you showed up — and when you didn\'t.',
    visual: 'heatmap',
  },
  {
    key: 'streak',
    span: 'lg:col-span-1',
    accent: '#FB923C',
    title: 'Build unstoppable streaks',
    desc: 'Track consecutive active days per goal. Missing one has never felt so expensive.',
    visual: 'streak',
  },
  {
    key: 'timer',
    span: 'lg:col-span-1',
    accent: '#34D399',
    title: 'Focus mode built in',
    desc: 'A distraction-free timer tied to each goal. Log time the moment you finish a session.',
    visual: 'timer',
  },
  {
    key: 'journal',
    span: 'lg:col-span-1',
    accent: '#F472B6',
    title: 'Journal your journey',
    desc: 'Write about what you worked on, what clicked, and how you felt. Every session has a story.',
    visual: 'journal',
  },
  {
    key: 'chart',
    span: 'lg:col-span-1',
    accent: '#c084fc',
    title: 'Progress you can see',
    desc: 'Bar charts, cumulative lines, and donut charts reveal exactly where your time goes.',
    visual: 'chart',
  },
];


/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--gs-bg)' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: 'var(--gs-nav-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--gs-border)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <span className="font-black tracking-tight" style={{ fontSize: 20, letterSpacing: '-0.03em' }}>
            <span className="text-gradient-white">Goal </span>
            <span className="text-gradient-purple">Story</span>
          </span>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-6">
            {[['Features', '#features'], ['How it works', '#how-it-works'], ['Journal', '#features']].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-sm transition-opacity hover:opacity-100 opacity-60"
                style={{ color: 'var(--gs-text)' }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <ThemeSwitch />
            <Link
              href="/login"
              className="text-sm hidden sm:block opacity-60 hover:opacity-100 transition-all duration-150 hover:translate-x-0.5"
              style={{ color: 'var(--gs-text)' }}
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.05] hover:-translate-y-px active:scale-[0.98]"
              style={{ background: 'var(--gs-accent)' }}
            >
              Get started <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
        {/* Background effects */}
        <div className="absolute inset-0 dot-grid pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% -5%, rgba(129,140,248,0.14), transparent)',
        }} />
        <div className="absolute top-1/4 right-0 w-1/3 h-1/2 pointer-events-none" style={{
          background: 'radial-gradient(ellipse, rgba(192,132,252,0.07), transparent 70%)',
          filter: 'blur(40px)',
        }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left: copy */}
            <div className="flex-1 text-center lg:text-left">
              <div className="animate-fade-in delay-100">
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-7 border"
                  style={{ background: 'var(--gs-accent-bg)', borderColor: 'var(--gs-accent-border)', color: 'var(--gs-accent)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse inline-block" />
                  Free to use · No credit card
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-[68px] font-black tracking-tight leading-[1.05] mb-6">
                <span className="animate-fade-in delay-200 block" style={{ color: 'var(--gs-text)' }}>
                  The goal tracker
                </span>
                <span className="animate-fade-in delay-300 block text-gradient">
                  for people who mean it.
                </span>
              </h1>

              <p className="animate-fade-in delay-500 text-lg lg:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10"
                style={{ color: 'var(--gs-text-dim)' }}>
                Set goals, log your time, journal your progress, and watch consistency
                tell a story — with heatmaps, streaks, charts, and a built-in focus timer.
              </p>

              <div className="animate-fade-in delay-500 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link href="/login"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold text-white shadow-lg w-full sm:w-auto justify-center transition-all duration-200 hover:scale-[1.04] hover:-translate-y-0.5 active:scale-[0.97]"
                  style={{ background: 'var(--gs-accent)', boxShadow: '0 8px 32px rgba(129,140,248,0.35)' }}>
                  Start for free <ArrowRight size={16} />
                </Link>
                <Link href="/login"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold border w-full sm:w-auto justify-center transition-all duration-200 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.97]"
                  style={{ color: 'var(--gs-text)', borderColor: 'var(--gs-border-mid)' }}>
                  Sign in
                </Link>
              </div>

              {/* Trust row */}
              <div className="animate-fade-in delay-500 flex items-center justify-center lg:justify-start gap-5 mt-8">
                {['Free forever', 'No card needed', '2-min setup'].map((t) => (
                  <div key={t} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--gs-text-dim)' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="6" fill="rgba(129,140,248,0.15)" />
                      <path d="M3.5 6l1.8 1.8L8.5 4.5" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: animated goals mockup */}
            <div className="flex-1 flex justify-center lg:justify-end w-full">
              <div className="relative w-full max-w-[760px]">
                {/* Glow behind mockup */}
                <div className="absolute -inset-8 pointer-events-none" style={{
                  background: 'radial-gradient(ellipse, rgba(129,140,248,0.15), transparent 70%)',
                  filter: 'blur(40px)',
                }} />
                <AnimatedWeekBarMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bento features ─────────────────────────────────────────────── */}
      <section id="features" className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--gs-accent)' }}>
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--gs-text)' }}>
              Everything you need to stay consistent
            </h2>
            <p className="text-base max-w-md mx-auto" style={{ color: 'var(--gs-text-dim)' }}>
              Purposefully simple. Visually rich. Built around the habit of showing up every day.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ key, span, accent, title, desc, visual }, i) => (
              <ScrollReveal key={key} delay={i * 80} className={span}>
                <div
                  className="rounded-2xl border p-6 h-full flex flex-col gap-4 hover:scale-[1.01] transition-transform duration-300"
                  style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}
                >
                  {/* Visual preview */}
                  <div
                    className="rounded-xl p-4 flex items-center justify-center overflow-hidden min-h-[100px]"
                    style={{ background: `${accent}0d`, border: `1px solid ${accent}22` }}
                  >
                    <AnimatedBentoVisual type={visual} />
                  </div>

                  <div>
                    <h3 className="font-bold mb-1.5" style={{ color: 'var(--gs-text)' }}>{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--gs-text-dim)' }}>{desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────── */}
      <section id="how-it-works" className="relative px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(129,140,248,0.05), transparent)',
        }} />

        <div className="relative max-w-4xl mx-auto">
          <ScrollReveal className="text-center mb-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--gs-accent)' }}>
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--gs-text)' }}>
              Set goals. Track time. See the story.
            </h2>
            <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--gs-text-dim)' }}>
              Set goals with deadlines, track time on every task, and let the visuals tell you the truth.
            </p>
          </ScrollReveal>

          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-12">
            {/* Connecting gradient line */}
            <div
              className="hidden sm:block absolute h-px pointer-events-none"
              style={{
                top: 27,
                left: '17%',
                right: '17%',
                background: 'linear-gradient(90deg, rgba(129,140,248,0.35), rgba(52,211,153,0.35), rgba(251,146,60,0.35))',
              }}
            />

            {([
              { n: '01', Icon: Target,     color: '#818CF8', title: 'Set goals & add tasks',      desc: 'Create a goal with a deadline, then break it down into tasks. Each task is something you can sit down and actually do.' },
              { n: '02', Icon: PenLine,    color: '#34D399', title: 'Track time & journal',        desc: 'Use the built-in timer to log exactly how long you spend on each task. Write a journal entry after every session to capture what you learned.' },
              { n: '03', Icon: TrendingUp, color: '#FB923C', title: 'See where your time goes',    desc: 'Heatmaps, bar charts, streaks, and donut charts show a full breakdown of time spent across every goal — so nothing stays invisible.' },
            ] as const).map(({ n, Icon, color, title, desc }, i) => (
              <ScrollReveal key={n} delay={i * 120}>
                <div className="flex flex-col items-center text-center">

                  {/* Icon with ghost number behind */}
                  <div className="relative mb-6">
                    <span
                      className="absolute inset-0 flex items-center justify-center text-[72px] font-black select-none pointer-events-none"
                      style={{ color, opacity: 0.07, transform: 'translateY(-8px)' }}
                    >
                      {n}
                    </span>
                    <div
                      className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${color}22, ${color}08)`,
                        border: `1px solid ${color}38`,
                        boxShadow: `0 0 28px ${color}20, 0 0 0 6px ${color}06`,
                      }}
                    >
                      <Icon size={22} style={{ color }} strokeWidth={1.75} />
                    </div>
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2.5" style={{ color, opacity: 0.8 }}>
                    Step {n.slice(1)}
                  </p>
                  <h3 className="font-bold text-base mb-2" style={{ color: 'var(--gs-text)' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--gs-text-dim)' }}>{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <ScrollReveal>
          <div
            className="max-w-2xl mx-auto rounded-3xl border p-12 text-center relative overflow-hidden"
            style={{ background: 'var(--gs-card)', borderColor: 'var(--gs-border)' }}
          >
            <div className="absolute inset-0 dot-grid pointer-events-none opacity-50" />
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse 60% 60% at 50% 100%, rgba(129,140,248,0.12), transparent)',
            }} />
            <div className="relative">
              <AnimatedTarget />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--gs-text)' }}>
                Don't just set goals.<br />Prove you meant them.
              </h2>
              <p className="text-base mb-8 max-w-md mx-auto" style={{ color: 'var(--gs-text-dim)' }}>
                Track every hour. Journal every session. Build a visual record of your consistency — free, forever.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white transition-all duration-200 hover:scale-[1.05] hover:-translate-y-0.5 active:scale-[0.97]"
                style={{ background: 'var(--gs-accent)', boxShadow: '0 8px 32px rgba(129,140,248,0.4)' }}
              >
                Start for free <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t px-6 py-8" style={{ borderColor: 'var(--gs-border)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>🎯</span>
            <span className="font-bold text-sm" style={{ color: 'var(--gs-text)' }}>Goal Story</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--gs-text-faint)' }}>
            © {new Date().getFullYear()} Goal Story · Built for people who mean it.
          </p>
          <Link href="/login" className="text-xs font-medium transition-all duration-150 hover:translate-x-1 hover:opacity-100 opacity-60 inline-block" style={{ color: 'var(--gs-text-dim)' }}>
            Sign in →
          </Link>
        </div>
      </footer>

    </div>
  );
}
