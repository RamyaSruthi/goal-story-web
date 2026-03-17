import type { Metadata } from 'next';
import { Inter, Syne } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const syne  = Syne({ subsets: ['latin'], variable: '--font-display', weight: ['700', '800'] });

export const metadata: Metadata = {
  title: { default: 'Goal Story', template: '%s | Goal Story' },
  description: 'Track your goals, build daily habits, and visualise your progress with heatmaps and charts.',
  keywords: ['goal tracking', 'habit tracker', 'productivity', 'journaling'],
  openGraph: {
    title: 'Goal Story',
    description: 'Track your goals, build daily habits, and visualise your progress.',
    type: 'website',
    siteName: 'Goal Story',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goal Story',
    description: 'Track your goals, build daily habits, and visualise your progress.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${syne.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
