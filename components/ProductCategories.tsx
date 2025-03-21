'use client';

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getProductLines } from "@/lib/api";
import { ProductLine } from "@/types/products";
import Image from "next/image";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowRightIcon
} from '@heroicons/react/24/solid';
import { useTheme } from 'next-themes';

// Placeholder image URL
const placeholderImage = "/placeholder-image.jpg";
const getImageUrl = (url?: string) => url ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}` : placeholderImage;

const ITEMS_PER_PAGE_SMALL = 1; // 1 item per page for small screens
const ITEMS_PER_PAGE_MEDIUM = 2; // 2 items per page for medium screens
const ITEMS_PER_PAGE_LARGE = 3; // 3 items per page for larger screens
const ITEMS_PER_PAGE_XL = 4; // 4 item per page for extra-large screens

export default function ProductCategories() {
    const [productLines, setProductLines] = useState<ProductLine[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_SMALL);
    const [isLoading, setIsLoading] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [mounted, setMounted] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);
    const { resolvedTheme } = useTheme();

    // Set mounted to true after component mounts
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Fetch product lines when the component is mounted
        const fetchProductLines = async () => {
            setIsLoading(true);
            try {
                const data = await getProductLines();
                setProductLines(data);
            } catch (error) {
                console.error("Error fetching product lines:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductLines();

        // Set the appropriate number of items per page based on screen size
        const updateItemsPerPage = () => {
            if (window.innerWidth >= 1280) {
                setItemsPerPage(ITEMS_PER_PAGE_XL);
            } else if (window.innerWidth >= 1024) {
                setItemsPerPage(ITEMS_PER_PAGE_LARGE);
            } else if (window.innerWidth >= 768) {
                setItemsPerPage(ITEMS_PER_PAGE_MEDIUM);
            } else {
                setItemsPerPage(ITEMS_PER_PAGE_SMALL);
            }
        };

        // Run once on component mount
        updateItemsPerPage();

        // Listen for screen size changes
        window.addEventListener('resize', updateItemsPerPage);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', updateItemsPerPage);
        };
    }, []);

    const totalPages = Math.ceil(productLines.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProductLines = productLines.slice(startIndex, startIndex + itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentPage(currentPage + 1);
                setIsTransitioning(false);
            }, 300);
        } else {
            // Loop back to first page when at the end
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentPage(1);
                setIsTransitioning(false);
            }, 300);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentPage(currentPage - 1);
                setIsTransitioning(false);
            }, 300);
        } else {
            // Loop to last page when at the beginning
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentPage(totalPages);
                setIsTransitioning(false);
            }, 300);
        }
    };

    // Determine if we're in dark mode
    const isDarkMode = mounted && resolvedTheme === 'dark';

    // Generate dots for pagination indicator
    const renderPaginationDots = () => {
        return Array.from({ length: totalPages }).map((_, index) => (
            <button
                key={index}
                className={`h-3 w-3 rounded-full mx-1 transition-all duration-300 cursor-pointer ${currentPage === index + 1
                        ? isDarkMode
                            ? 'bg-blue-400 w-6'
                            : 'bg-blue-600 w-6'
                        : isDarkMode
                            ? 'bg-gray-600 hover:bg-gray-500'
                            : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                        setCurrentPage(index + 1);
                        setIsTransitioning(false);
                    }, 300);
                }}
                aria-label={`Go to page ${index + 1}`}
            />
        ));
    };

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
        <section className={`${isDarkMode
                ? 'bg-gradient-to-b from-gray-900 to-gray-800'
                : 'bg-gradient-to-b from-white to-gray-50'
            } py-16`}
        >
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Explore Our Products
                    </h2>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
                        Discover our professional pressure washing equipment designed for industrial and commercial applications.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDarkMode ? 'border-blue-400' : 'border-blue-500'}`}></div>
                    </div>
                ) : (
                    <>
                        {/* Main container with arrows on the sides */}
                        <div className="flex items-center justify-center relative">
                            {/* Left Arrow */}
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`${isDarkMode
                                        ? 'bg-gray-800 text-blue-400 hover:bg-gray-700'
                                        : 'bg-white text-blue-600 hover:bg-gray-100'
                                    } h-12 w-12 rounded-full shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center absolute left-0 lg:-left-6 z-10`}
                                aria-label="Previous page"
                            >
                                <ChevronLeftIcon className="w-6 h-6" />
                            </button>

                            {/* Cards Container */}
                            <div
                                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 transition-opacity duration-300 w-full ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                                ref={carouselRef}
                            >
                                {currentProductLines.map((productLine: ProductLine) => (
                                    <div
                                        key={productLine.slug}
                                        className="group cursor-pointer"
                                    >
                                        <Link href={`/products/${productLine.slug}`} className="block h-full">
                                            <div className={`${isDarkMode
                                                    ? 'bg-gray-800 shadow-gray-900/30 hover:shadow-blue-900/20'
                                                    : 'bg-white shadow-md hover:shadow-xl'
                                                } rounded-xl overflow-hidden h-full flex flex-col transition-all duration-300 transform group-hover:-translate-y-1`}
                                            >
                                                <div className="relative aspect-square overflow-hidden">
                                                    <Image
                                                        src={getImageUrl(productLine.image?.url)}
                                                        alt={productLine.name}
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
                                                        {productLine.name}
                                                    </h3>

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
                                    </div>
                                ))}
                            </div>

                            {/* Right Arrow */}
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className={`${isDarkMode
                                        ? 'bg-gray-800 text-blue-400 hover:bg-gray-700'
                                        : 'bg-white text-blue-600 hover:bg-gray-100'
                                    } h-12 w-12 rounded-full shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center absolute right-0 lg:-right-6 z-10`}
                                aria-label="Next page"
                            >
                                <ChevronRightIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Dot Indicators */}
                        <div className="flex justify-center items-center mt-8 space-x-1">
                            {renderPaginationDots()}
                        </div>

                        {/* Page Counter */}
                        <div className={`text-center mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                            Page {currentPage} of {totalPages}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}