"use client";

import { useState, useEffect } from "react";
import { getPartBySlug, processRichText } from "../../../../lib/api";
import { Part } from "@/types/parts";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import GalleryPage from "@/components/GalleryPage";
import Link from "next/link";
import { ArrowLeftIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { use } from "react";

type PartDetailPageProps = {
    params: Promise<{
        categorySlug: string;
        itemSlug: string;
    }>;
};

export default function PartDetailPage({ params }: PartDetailPageProps) {
    // Unwrap the params Promise using React.use()
    const resolvedParams = use(params);
    const { categorySlug, itemSlug } = resolvedParams;

    const [part, setPart] = useState<Part>();
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    // Set mounted to true after component mounts
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchPart = async () => {
            setIsLoading(true);
            try {
                const data = await getPartBySlug(itemSlug);
                setPart(data);
            } catch (error) {
                console.error("Error fetching part:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPart();
    }, [itemSlug]);

    // Determine if we're in dark mode
    const isDarkMode = mounted && resolvedTheme === 'dark';

    // Don't render with theme-specific styles until mounted to prevent hydration mismatch
    if (!mounted || isLoading) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (!part) {
        return (
            <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} py-16`}>
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Part Not Found</h2>
                    <p className="mb-8">The part you're looking for doesn't exist or may have been moved.</p>
                    <Link href={`/parts-and-accessories/${categorySlug}`}>
                        <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                            Return to Category
                        </button>
                    </Link>
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
                {/* Back to category link */}
                <Link href={`/parts-and-accessories/${categorySlug}`} className={`inline-flex items-center mb-6 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                    } transition-colors`}>
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to {part.part_category?.name || 'Category'}
                </Link>

                {/* Part Title and Category */}
                <div className="mb-6">
                    <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {part.name}
                    </h1>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {part.part_category?.name}
                    </p>
                </div>

                {/* Main content container with shadow */}
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                    <div className="flex flex-col lg:flex-row items-start gap-6 p-6">
                        {/* Gallery (on larger screens, take up 1/2 of the width) */}
                        <div className="flex-shrink-0 w-full lg:w-1/2">
                            <GalleryPage item={part} />
                        </div>

                        {/* Part Description */}
                        <div className={`flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <div className="prose prose-lg max-w-none">
                                {part.description ? (
                                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                        {processRichText(part.description)}
                                    </ReactMarkdown>
                                ) : (
                                    <p>Detailed part information coming soon. Please contact us for specifications and pricing.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Call to Action */}
                <div className={`mt-12 p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}>
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="flex items-center justify-center mb-4">
                            <InformationCircleIcon className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
                            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                Need this part?
                            </h3>
                        </div>
                        <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Contact our parts department for pricing, availability, and to place an order.
                            We offer fast shipping and can help ensure you get the right part for your equipment.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/contact">
                                <button className="w-full cursor-pointer sm:w-auto bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition shadow-lg transform hover:-translate-y-1 duration-300">
                                    Order Now
                                </button>
                            </Link>
                            <Link href="/contact">
                                <button className="w-full cursor-pointer sm:w-auto bg-transparent border-2 border-blue-600 text-blue-600 py-3 px-8 rounded-lg hover:bg-blue-50 transition shadow-lg transform hover:-translate-y-1 duration-300">
                                    Ask a Question
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}