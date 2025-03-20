import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import Header from '@/components/Header'; // Import your Header component
import Footer from '@/components/Footer'; // Import your Footer component

export const metadata: Metadata = {
  title: 'Pressure Systems Company',
  description: 'Professional pressure washing equipment and solutions for industrial and commercial applications',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header /> {/* Include your site's header */}
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