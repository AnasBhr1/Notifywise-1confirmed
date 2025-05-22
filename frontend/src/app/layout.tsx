import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NotifyWise - WhatsApp Appointment Reminders',
  description: 'Professional WhatsApp appointment reminder system for service-based businesses',
  keywords: ['appointments', 'reminders', 'whatsapp', 'business', 'scheduling', 'notifications'],
  authors: [{ name: 'NotifyWise Team' }],
  creator: 'NotifyWise',
  publisher: 'NotifyWise',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://notifywise.com',
    title: 'NotifyWise - WhatsApp Appointment Reminders',
    description: 'Professional WhatsApp appointment reminder system for service-based businesses',
    siteName: 'NotifyWise',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NotifyWise - WhatsApp Appointment Reminders',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NotifyWise - WhatsApp Appointment Reminders',
    description: 'Professional WhatsApp appointment reminder system for service-based businesses',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative min-h-screen bg-background">
              {/* Background gradient */}
              <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
              </div>
              
              {/* Main content */}
              <main className="relative z-10">
                {children}
              </main>
              
              {/* Toast notifications */}
              <Toaster />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}