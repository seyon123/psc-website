"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function AboutSection() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if we're in dark mode
  const isDarkMode = mounted && resolvedTheme === 'dark';

  // Don't render with theme-specific styles until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              About Pressure Systems Company
            </h2>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Since 1969, PSC Cleaning Systems Inc. now operating as PSC Pressure Systems Company Inc. have been the industry leader in pressure washing systems, providing high-quality equipment and solutions to industrial and commercial clients across the world.
            </p>
            <p className={`mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Our mission is to provide customers with the highest quality pressure washing equipment backed by unparalleled service and support. We strive to continually innovate and develop solutions that help our customers improve efficiency, reduce costs, and achieve better results.
            </p>
            <Link href="/about" className={`inline-block px-6 py-3 rounded-lg ${isDarkMode
                ? 'bg-blue-700 hover:bg-blue-600'
                : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-medium transition-all shadow-md transform hover:-translate-y-1`}
            >
              Learn More About Us
            </Link>
          </div>
          <div className="md:w-1/2 relative">
            <div className="relative h-80 w-full md:h-96 overflow-hidden rounded-xl shadow-xl">
              <Image
                src="/psc-entrance.png"
                alt="Pressure Systems Company building"
                fill
                className="object-cover"
              />
              <div className={`absolute inset-0 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-600'} opacity-20`}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}