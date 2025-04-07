// app/layout.tsx
import './globals.css';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { ChatProvider } from '@/app/providers/ChatProvider';
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

        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Pressure Systems Company',
              image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pscclean.com'}/psc-entrance.png`,
              legalName: 'Pressure Systems Company Inc',
              alternateName: 'PSC Clean',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://pscclean.com',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pscclean.com'}/logo.png`,
              email: "info@pscclean.com",
              telephone: '+18002469689',
              address: {
                "@type": "PostalAddress",
                "streetAddress": "3300 Steeles Ave. West #27",
                "addressLocality": "Concord",
                "addressCountry": "CA",
                "addressRegion": "Ontario",
                "postalCode": "L4K 2Y4"
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+18002469689',
                email: "info@pscclean.com",
                contactType: 'customer service',
                areaServed: 'CA',
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
          <ChatProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}