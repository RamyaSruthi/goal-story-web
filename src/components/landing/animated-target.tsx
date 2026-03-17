'use client';

export function AnimatedTarget() {
  return (
    <div className="relative inline-flex items-center justify-center mb-6">
      {/* Soft glow that breathes */}
      <span
        className="absolute rounded-full"
        style={{
          width: 96,
          height: 96,
          background: 'radial-gradient(circle, rgba(129,140,248,0.35), transparent 70%)',
          animation: 'target-glow 2.4s ease-in-out infinite',
          filter: 'blur(12px)',
        }}
      />
      <span className="relative z-10 select-none" style={{ fontSize: 56, lineHeight: 1 }}>🎯</span>
    </div>
  );
}
