"use client";

import { ProductLine } from "@/types/products";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { processRichText } from "@/lib/api";

// Placeholder image URL
const placeholderImage = "/placeholder-image.jpg";

// Helper function to get the full image URL
const getImageUrl = (url?: string) => url ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}` : placeholderImage;

type ProductLinesGridProps = {
  productLines: ProductLine[];
};

export default function ProductLinesGrid({ productLines }: ProductLinesGridProps) {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { resolvedTheme } = useTheme();

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true);
    setIsLoading(false);
  }, []);

  // Determine if we're in dark mode
  const isDarkMode = mounted && resolvedTheme === 'dark';

  // Don't render with theme-specific styles until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode
      ? 'bg-gradient-to-b from-gray-900 to-gray-800'
      : 'bg-gradient-to-b from-white to-gray-50'
      } py-16`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Our Product Categories
          </h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Discover our professional pressure washing equipment designed for industrial and commercial applications.
            Browse through our product lines to find the perfect solution for your needs.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDarkMode ? 'border-blue-400' : 'border-blue-500'}`}></div>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productLines.map((line: ProductLine) => (
              <li key={line.slug} className="group cursor-pointer h-full">
                <Link href={`/products/${line.slug}`} className="block h-full">
                  <div className={`${isDarkMode
                    ? 'bg-gray-800 shadow-gray-900/30 hover:shadow-blue-900/20'
                    : 'bg-white shadow-md hover:shadow-xl'
                    } rounded-xl overflow-hidden h-full flex flex-col transition-all duration-300 transform group-hover:-translate-y-1`}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={getImageUrl(line.image?.url)}
                        alt={line.name}
                        fill={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-contain p-2 transition-all duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <h3 className={`text-xl font-semibold text-center ${isDarkMode
                        ? 'text-white group-hover:text-blue-400'
                        : 'text-gray-800 group-hover:text-blue-600'
                        } transition-colors`}
                      >
                        {line.name}
                      </h3>

                      <div className="mt-3 flex-1">
                        <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-3`}>
                          {line.shortDescription || (line.description ?
                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                              {processRichText(line.description).substring(0, 150) + "..."}
                            </ReactMarkdown> :
                            "Explore our range of professional equipment.")}
                        </div>
                      </div>

                      <div
                        className={`mt-4 ${isDarkMode
                          ? 'bg-blue-700 hover:bg-blue-600'
                          : 'bg-blue-600 hover:bg-blue-700'
                          } text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer`}
                      >
                        View Products
                        <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}