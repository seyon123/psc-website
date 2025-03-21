"use client";

import { getProductLineBySlug, processRichText } from "@/lib/api";
import { Product, ProductLine } from "@/types/products";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import { use } from "react";

// Helper function to get the full image URL
const getImageUrl = (url?: string) => url ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}` : "/placeholder-image.jpg";

export default function ProductLinePage({ params }: { params: Promise<{ productLineSlug: string }> }) {
    // Unwrap the params Promise using React.use()
    const resolvedParams = use(params);
    const productLineSlug = resolvedParams.productLineSlug;

    const [productLine, setProductLine] = useState<ProductLine>();
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    // Set mounted to true after component mounts
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!productLineSlug) return;

        const fetchProductLine = async () => {
            setIsLoading(true);
            try {
                const data = await getProductLineBySlug(productLineSlug);
                setProductLine(data);
            } catch (error) {
                console.error("Error fetching product line:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductLine();
    }, [productLineSlug]);

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

    if (!productLine) {
        return (
            <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} py-16`}>
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Product Line Not Found</h2>
                    <p className="mb-8">The product line you&apos;re looking for doesn&apos;t exist or may have been moved.</p>
                    <Link href="/products">
                        <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                            Return to Products
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
                <div className="mb-12">
                    <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {productLine.name}
                    </h1>

                    <div className="flex flex-col lg:flex-row gap-8 mb-12">
                        {/* Product Line Image */}
                        <div className="lg:w-1/3">
                            {productLine.image && (
                                <div className={`rounded-xl overflow-hidden shadow-lg ${isDarkMode ? 'shadow-blue-900/20' : ''}`}>
                                    <Image
                                        src={getImageUrl(productLine.image.url)}
                                        alt={productLine.name}
                                        width={productLine.image.width || 600}
                                        height={productLine.image.height || 400}
                                        className="w-full object-cover object-center"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Product Line Description */}
                        <div className={`lg:w-2/3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <div className="prose prose-lg max-w-none">
                                {productLine.description ? (
                                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                        {processRichText(productLine.description)}
                                    </ReactMarkdown>
                                ) : (
                                    <p>Explore our range of professional {productLine.name} designed for optimal performance in demanding environments.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Products Section */}
                    <div className="mt-12">
                        <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            Products in this Category
                        </h2>

                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {productLine.products && productLine.products.map((product: Product) => (
                                <li key={product.slug} className="group cursor-pointer h-full">
                                    <Link href={`/products/${productLineSlug}/${product.slug}`} className="block h-full">
                                        <div className={`${isDarkMode
                                            ? 'bg-gray-800 shadow-gray-900/30 hover:shadow-blue-900/20'
                                            : 'bg-white shadow-md hover:shadow-xl'
                                            } rounded-xl overflow-hidden h-full flex flex-col transition-all duration-300 transform group-hover:-translate-y-1`}
                                        >
                                            <div className="relative aspect-square overflow-hidden">
                                                {product.image && product.image.length > 0 && product.image[0].url && (
                                                    <Image
                                                        src={getImageUrl(product.image[0].url)}
                                                        alt={product.name}
                                                        fill={true}
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                                        className="object-cover object-center p-2 transition-all duration-500 group-hover:scale-105"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>

                                            <div className="p-6 flex-1 flex flex-col justify-between">
                                                <h3 className={`text-xl font-semibold ${isDarkMode
                                                    ? 'text-white group-hover:text-blue-400'
                                                    : 'text-gray-800 group-hover:text-blue-600'
                                                    } transition-colors`}
                                                >
                                                    {product.name}
                                                </h3>

                                                <div className="mt-3 flex-1">
                                                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-3`}>
                                                        {product.shortDescription || (product.description ?
                                                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                                                {processRichText(product.description).substring(0, 150) + "..."}
                                                            </ReactMarkdown> :
                                                            "View details and specifications for this product.")}
                                                    </div>
                                                </div>

                                                <div
                                                    className={`mt-4 ${isDarkMode
                                                        ? 'bg-blue-700 hover:bg-blue-600'
                                                        : 'bg-blue-600 hover:bg-blue-700'
                                                        } text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer`}
                                                >
                                                    View Product
                                                    <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}