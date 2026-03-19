import type { Metadata } from 'next';
import { Inter, Syne } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const syne  = Syne({ subsets: ['latin'], variable: '--font-display', weight: ['700', '800'] });

export const metadata: Metadata = {
  title: { default: 'Goal Story — Goal Tracker & Habit Tracker App', template: '%s | Goal Story' },
  description: 'Goal Story is a free goal tracker and habit tracker app. Set goals, break them into tasks, track time with a focus timer, and visualize your progress with heatmaps, streaks, and charts.',
  keywords: [
    'goal tracker',
    'goal tracker app',
    'habit tracker',
    'habit tracker app',
    'goal tracking app',
    'focus timer',
    'productivity app',
    'time tracker',
    'goal setting app',
    'progress tracker',
    'heatmap tracker',
    'streak tracker',
    'daily habit tracker',
    'free goal tracker',
    'goal journal',
    'task timer',
    'personal productivity',
    'goal story',
  ],
  metadataBase: new URL('https://goalstory.app'),
  alternates: { canonical: 'https://goalstory.app' },
  openGraph: {
    title: 'Goal Story — Goal Tracker & Habit Tracker App',
    description: 'Set goals, track time, journal your progress, and see your consistency with heatmaps and charts. Free forever.',
    type: 'website',
    url: 'https://goalstory.app',
    siteName: 'Goal Story',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goal Story — Goal Tracker & Habit Tracker App',
    description: 'Set goals, track time, journal your progress, and see your consistency with heatmaps and charts. Free forever.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${syne.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
