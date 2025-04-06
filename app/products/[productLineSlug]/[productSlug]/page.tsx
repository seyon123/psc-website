"use client";

import { getProductBySlug, processRichText } from "@/lib/api";
import { ProductWithModels } from "@/types/models";
import { ModelRow } from "@/types/models";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import GalleryPage from "@/components/GalleryPage";
import ProductModelsTable from "@/components/ProductModelsTable";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import { use } from "react";

type ProductPageProps = {
    params: Promise<{
        productLineSlug: string;
        productSlug: string;
    }>;
};

// Helper function to get the full image URL
const getImageUrl = (url?: string) => url ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}` : "/placeholder-image.jpg";

export default function ProductPage({ params }: ProductPageProps) {
    // Unwrap the params Promise using React.use()
    const resolvedParams = use(params);
    const { productLineSlug, productSlug } = resolvedParams;
    
    // Router for navigation
    // Search params for model parameter
    const searchParams = useSearchParams();
    const modelParam = searchParams.get('model');

    const [product, setProduct] = useState<ProductWithModels>();
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    // State for the current displayed image
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    // Default product image for fallback
    const [defaultImage, setDefaultImage] = useState<string | null>(null);
    // State for the currently selected model
    const [selectedModel, setSelectedModel] = useState<ModelRow | null>(null);

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

                // Set default image from product
                if (data?.image && data.image.length > 0 && data.image[0].url) {
                    const productImageUrl = getImageUrl(data.image[0].url);
                    setCurrentImage(productImageUrl);
                    setDefaultImage(productImageUrl);
                }
                
                // Check if there's a model in the URL and select it
                if (modelParam && data?.models?.modelTables) {
                    // Find the model across all model tables
                    let foundModel: ModelRow | null = null;
                    
                    data.models.modelTables.forEach((table: { rows: ModelRow[] }) => {
                        const model = table.rows.find((row: ModelRow) => 
                            row.model?.toString().toLowerCase() === modelParam.toLowerCase()
                        );
                        if (model) foundModel = model;
                    });
                    
                    if (foundModel) {
                        // Set the found model as selected
                        setSelectedModel(foundModel);
                        
                        // Update the image if the model has one
                        if (foundModel.image) {
                            setCurrentImage(getImageUrl(foundModel.image));
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [productSlug, modelParam]);

    // Handler for when a model is clicked
    const handleModelSelect = (model: ModelRow) => {
        // Set the selected model for displaying specs
        setSelectedModel(model);

        // Update the displayed image if available, otherwise use default product image
        if (model.image) {
            setCurrentImage(getImageUrl(model.image));
        } else if (defaultImage) {
            // Fall back to default product image if model has no image
            setCurrentImage(defaultImage);
        }
        
        // Update the URL with the selected model using browser history API directly
        // This avoids any page refresh or scroll jumping that might happen with router
        const modelStr = model.model?.toString().toLowerCase();
        if (modelStr && typeof window !== 'undefined') {
            // Create the new URL using current path and updated model parameter
            const url = new URL(window.location.href);
            url.searchParams.set('model', modelStr);
            
            // Update browser history without triggering navigation
            window.history.pushState({ path: url.toString() }, '', url.toString());
        }
    };

    // Handler for clearing model selection
    const clearModelSelection = () => {
        setSelectedModel(null);
        setCurrentImage(defaultImage);
        
        // Remove model from URL using browser history API
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('model');
            
            // Update browser history without triggering navigation
            window.history.pushState({ path: url.toString() }, '', url.toString());
        }
    };

    // Format specification name for display
    const formatSpecName = (name: string): string => {
        return name
            .replace(/_/g, ' ')
            .toUpperCase();
    };

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
                    {selectedModel && (
                        <span className="text-2xl font-normal">
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Model:</span> {selectedModel.model}
                        </span>
                    )}

                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {product.product_line?.name}
                    </p>
                </div>

                {/* Flexbox container to hold gallery and description */}
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                    <div className="flex flex-col lg:flex-row items-start gap-6 p-6">
                        {/* Product Image Section (customized to handle model images) */}
                        <div className="flex-shrink-0 w-full lg:w-1/2 flex items-center justify-center self-center lg:self-start">
                            <div className="w-full">
                                {selectedModel ? (
                                    // If a specific model is selected, show its image
                                    <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-md">
                                        <Image
                                            src={currentImage || (defaultImage || "/placeholder-image.jpg")}
                                            alt={`${product.name} - ${selectedModel.model}`}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                ) : (
                                    // If no model is selected, use the GalleryPage for multiple images
                                    <GalleryPage item={product} />
                                )}
                            </div>
                        </div>

                        {/* Product Description */}
                        <div className={`flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {/* Show selected model specifications if a model is selected */}
                            {selectedModel ? (
                                <div>
                                    <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                        {selectedModel.model} Specifications
                                    </h2>
                                    <div className={`p-4 rounded-lg mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                        <table className="w-full">
                                            <tbody>
                                                {Object.entries(selectedModel)
                                                    .filter(([key]) => !['model', 'image'].includes(key)) // Exclude model and image
                                                    .map(([key, value]) => (
                                                        <tr key={key} className={`border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                                            <th className={`py-2 px-4 text-left ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                                {formatSpecName(key)}
                                                            </th>
                                                            <td className="py-2 px-4">
                                                                {typeof value === 'boolean'
                                                                    ? (value ? '✓' : '-')
                                                                    : value}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-4">
                                        <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                            Product Description
                                        </h3>
                                        <div className="prose prose-lg max-w-none">
                                            {product.description ? (
                                                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                                    {processRichText(product.description)}
                                                </ReactMarkdown>
                                            ) : (
                                                <p>Detailed product information coming soon. Please contact us for more details.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Show default product description when no model is selected
                                <div className="prose prose-lg max-w-none">
                                    {product.description ? (
                                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                            {processRichText(product.description)}
                                        </ReactMarkdown>
                                    ) : (
                                        <p>Detailed product information coming soon. Please contact us for specifications and pricing.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Clear Selected Model button - only show when a model is selected */}
                {selectedModel && (
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={clearModelSelection}
                            className={`px-4 py-2 rounded-lg text-sm ${isDarkMode
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                } transition-colors cursor-pointer`}
                        >
                            Clear Model Selection
                        </button>
                    </div>
                )}

                {/* Product Models Table */}
                {product.models && product.models.modelTables && product.models.modelTables.length > 0 && (
                    <div className={`mt-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden p-6`}>
                        <ProductModelsTable
                            modelTables={product.models.modelTables}
                            productSlug={productSlug}
                            productLineSlug={productLineSlug}
                            onModelSelect={handleModelSelect}
                            selectedModel={selectedModel}
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