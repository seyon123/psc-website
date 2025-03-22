// app/layout.tsx
import './globals.css';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { defaultMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Pressure Systems Company',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://pscclean.com',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pscclean.com'}/logo.png`,
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+18002469689',
                contactType: 'customer service',
                areaServed: 'US',
                availableLanguage: 'English',
              },
              sameAs: [
                'https://www.facebook.com/pscclean',
                'https://www.instagram.com/pscclean',
                'https://www.linkedin.com/company/pressure-systems-company',
              ],
            }),
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}