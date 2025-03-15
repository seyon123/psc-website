import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'localhost', // Local domain
      (process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/^https?:\/\//, '').split('/')[0]) || 'localhost', // Use 'localhost' as fallback if undefined
    ],
  },
};

export default nextConfig;
