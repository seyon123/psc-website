// app/lib/metadata.ts
import { Metadata } from 'next';

// Base metadata that will be used as defaults
export const defaultMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://pscclean.com'),
  title: {
    template: '%s | Pressure Systems Company',
    default: 'Pressure Systems Company | Professional Pressure Washing Equipment & Solutions',
  },
  description: 'Pressure Systems Company provides high-quality pressure washing equipment and solutions for industrial and commercial applications since 1982.',
  keywords: [
    'pressure washing equipment', 
    'industrial cleaning solutions', 
    'commercial pressure washers', 
    'high-pressure cleaning systems',
    'pressure washing systems',
    'industrial cleaning equipment'
  ],
  authors: [{ name: 'Pressure Systems Company' }],
  creator: 'Pressure Systems Company',
  publisher: 'Pressure Systems Company',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://pscclean.com',
    siteName: 'Pressure Systems Company',
    title: 'Pressure Systems Company | Professional Pressure Washing Equipment & Solutions',
    description: 'Quality pressure washing equipment and solutions for industrial and commercial applications since 1982.',
    images: [
      {
        url: '/og-image.jpg', // You'll need to create this image in your public folder
        width: 1200,
        height: 630,
        alt: 'Pressure Systems Company',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pressure Systems Company | Professional Pressure Washing Equipment',
    description: 'Quality pressure washing equipment and solutions for industrial and commercial applications since 1982.',
    images: ['/og-image.jpg'],
    creator: '@pscclean', // Update with actual Twitter handle
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
    ],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
    languages: {
      'en-US': '/',
    },
  },
  verification: {
    google: 'your-google-site-verification', // Replace with actual Google verification code
  },
  category: 'industrial equipment',
};

// Function to generate metadata for specific pages
export function generateMetadata({
  title,
  description,
  image,
  path,
}: {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}): Metadata {
  const url = path ? `${process.env.NEXT_PUBLIC_SITE_URL}${path}` : process.env.NEXT_PUBLIC_SITE_URL;
  
  return {
    ...defaultMetadata,
    title: title || defaultMetadata.title,
    description: description || defaultMetadata.description as string,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: title || defaultMetadata.openGraph?.title,
      description: description || defaultMetadata.openGraph?.description,
      url,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title || (defaultMetadata.openGraph?.title as string),
            },
          ]
        : defaultMetadata.openGraph?.images,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: title || defaultMetadata.twitter?.title,
      description: description || defaultMetadata.twitter?.description,
      images: image ? [image] : defaultMetadata.twitter?.images,
    },
    alternates: {
      ...defaultMetadata.alternates,
      canonical: url,
    },
  };
}