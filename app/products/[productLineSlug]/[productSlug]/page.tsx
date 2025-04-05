"use client";

import { getProductBySlug, processRichText } from "@/lib/api";
import { ProductWithModels } from "@/types/models";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import GalleryPage from "@/components/GalleryPage";
import ProductModelsTable from "@/components/ProductModelsTable";
import Link from "next/link";
import { ArrowLeftIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { use } from "react";

type ProductPageProps = {
    params: Promise<{
        productLineSlug: string;
        productSlug: string;
    }>;
};

export default function ProductPage({ params }: ProductPageProps) {
    // Unwrap the params Promise using React.use()
    const resolvedParams = use(params);
    const { productLineSlug, productSlug } = resolvedParams;

    const [product, setProduct] = useState<ProductWithModels>();
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    // Set mounted to true after component mounts
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            try {
                const data = await getProductBySlug(productSlug);
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [productSlug]);

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

    if (!product) {
        return (
            <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} py-16`}>
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
                    <p className="mb-8">The product you&apos;re looking for doesn&apos;t exist or may have been moved.</p>
                    <Link href={`/products/${productLineSlug}`}>
                        <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                            Return to Product Line
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
                {/* Back to product line link */}
                <Link href={`/products/${productLineSlug}`} className={`inline-flex items-center mb-6 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                    } transition-colors`}>
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to {product.product_line?.name || 'Product Line'}
                </Link>

                {/* Product Title and Product Line */}
                <div className="mb-6">
                    <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {product.name}
                    </h1>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {product.product_line?.name}
                    </p>
                </div>

                {/* Flexbox container to hold gallery and description */}
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                    <div className="flex flex-col lg:flex-row items-start gap-6 p-6">
                        {/* Gallery (on larger screens, take up 1/2 of the width) */}
                        <div className="flex-shrink-0 w-full lg:w-1/2">
                            <GalleryPage item={product} />
                        </div>

                        {/* Product Description */}
                        <div className={`flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <div className="prose prose-lg max-w-none">
                                {product.description ? (
                                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                        {processRichText(product.description)}
                                    </ReactMarkdown>
                                ) : (
                                    <p>Detailed product information coming soon. Please contact us for specifications and pricing.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Models Table */}
                {product.models && product.models.modelTables && product.models.modelTables.length > 0 && (
                    <div className={`mt-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden p-6`}>
                        <ProductModelsTable 
                            modelTables={product.models.modelTables} 
                            productSlug={productSlug}
                            productLineSlug={productLineSlug}
                        />
                    </div>
                )}

                {/* Call to Action */}
                <div className={`mt-12 p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}>
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="flex items-center justify-center mb-4">
                            <InformationCircleIcon className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
                            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                Interested in this product?
                            </h3>
                        </div>
                        <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Contact our team for pricing, availability, and to discuss your specific requirements.
                            Our experts are ready to help you find the perfect solution for your needs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/contact">
                                <button className="w-full cursor-pointer sm:w-auto bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition shadow-lg transform hover:-translate-y-1 duration-300">
                                    Request Quote
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