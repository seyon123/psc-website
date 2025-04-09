"use client";

import { ProductWithModels, ModelRow } from "@/types/models";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import GalleryPage from "@/components/GalleryPage";
import ProductModelsTable from "@/components/ProductModelsTable";
import Link from "next/link";
import { 
    ArrowLeftIcon,
    InformationCircleIcon,
    CheckCircleIcon,
    XCircleIcon,
    Cog8ToothIcon
} from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation";
import { processRichText } from "@/lib/api";

type ProductDetailProps = {
    product: ProductWithModels | null;
    productLineSlug: string;
    productSlug: string;
    initialModelParam?: string;
};

// Helper function to get the full image URL
const getImageUrl = (url?: string) => {
    if (!url) return "/placeholder-image.jpg";
    
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "";
    
    // Check if the URL already includes the base URL to prevent duplication
    if (url.startsWith("http") || url.startsWith(baseUrl)) {
        return url;
    }
    
    return `${baseUrl}${url}`;
};

export default function ProductDetail({ product, productLineSlug, productSlug, initialModelParam }: ProductDetailProps) {
    // Router for navigation
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();
    const isDarkMode = mounted && resolvedTheme === 'dark';

    // Product state
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [defaultImage, setDefaultImage] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<ModelRow | null>(null);
    const [selectedModelImages, setSelectedModelImages] = useState<string[]>([]);

    // Set mounted to true after component mounts
    useEffect(() => {
        setMounted(true);
    }, []);

    // Initialize product data and handle model selection from URL
    useEffect(() => {
        if (!product) return;

        // Set default product image
        if (product.image?.[0]?.url) {
            const productImageUrl = getImageUrl(product.image[0].url);
            setCurrentImage(productImageUrl);
            setDefaultImage(productImageUrl);
        }

        // Handle model selection from URL parameter
        if (initialModelParam && product.models?.modelTables) {
            let foundModel: ModelRow | null = null;
            
            // Search for model across all tables
            for (const table of product.models.modelTables) {
                const model = table.rows.find(row => 
                    row.model?.toString().toLowerCase() === initialModelParam.toLowerCase()
                );
                if (model) {
                    foundModel = model;
                    break;
                }
            }

            if (foundModel) {
                setSelectedModel(foundModel);
                handleModelImageUpdate(foundModel);
            }
        }
    }, [product, initialModelParam]);

    // Helper to update images when a model is selected
    const handleModelImageUpdate = (model: ModelRow) => {
        if (!model.image) return;
        
        if (typeof model.image === 'string') {
            // Single image
            const imageUrl = getImageUrl(model.image);
            setCurrentImage(imageUrl);
            setSelectedModelImages([imageUrl]);
        } else if (Array.isArray(model.image)) {
            // Multiple images
            const imageUrls = model.image.map(img => getImageUrl(img));
            setSelectedModelImages(imageUrls);
            if (imageUrls.length > 0) {
                setCurrentImage(imageUrls[0]);
            }
        }
    };

    // Get the formatted column name from property name
    const getColumnName = (propName: string) => {
        if (!product?.models?.modelTables) {
            return propName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        }
        
        // Search for the property in all tables' columns
        for (const table of product.models.modelTables) {
            for (const column of table.columns) {
                const formattedColName = column.toLowerCase().replace(/\s/g, '_').replace(/[()."]/g, '');
                if (formattedColName === propName) {
                    return column; // Return the original formatted column name
                }
            }
        }
        
        // Fallback to formatting the property name
        return propName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    // Handler for model selection
    const handleModelSelect = (model: ModelRow) => {
        setSelectedModel(model);
        handleModelImageUpdate(model);
        
        // Update URL
        const modelStr = model.model?.toString().toLowerCase();
        if (modelStr) {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set('model', modelStr);
            
            router.replace(`/products/${productLineSlug}/${productSlug}?${newParams.toString()}`, {
                scroll: false
            });
        }
    };

    // Handler to clear model selection
    const clearModelSelection = () => {
        setSelectedModel(null);
        setCurrentImage(defaultImage);
        setSelectedModelImages([]);

        // Update URL
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete('model');
        
        router.replace(`/products/${productLineSlug}/${productSlug}`, {
            scroll: false
        });
    };

    // Render loading state or not found message
    if (!mounted) {
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
        <div className={`${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-white to-gray-50'} py-16`}>
            <div className="container mx-auto px-4">
                {/* Back to product line link */}
                <Link href={`/products/${productLineSlug}`} className={`inline-flex items-center mb-6 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors`}>
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to {product.product_line?.name || 'Product Line'}
                </Link>

                {/* Product Title */}
                <div className="mb-6">
                    <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {product.name}
                        {selectedModel && (
                            <span className="text-2xl font-normal ml-2">
                                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Model:</span> {selectedModel.model}
                            </span>
                        )}
                    </h1>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {product.product_line?.name}
                    </p>
                </div>

                {/* Product Content */}
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                    <div className="flex flex-col lg:flex-row items-start gap-6 p-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-full lg:w-1/2 flex items-center justify-center self-center">
                            <div className="w-full">
                                {selectedModel ? (
                                    <GalleryPage 
                                        item={product} 
                                        modelImages={{
                                            model: selectedModel.model,
                                            image: selectedModelImages.length > 0 ? selectedModelImages : 
                                                   (currentImage ? [currentImage] : undefined)
                                        }}
                                    />
                                ) : (
                                    <GalleryPage item={product} />
                                )}
                            </div>
                        </div>

                        {/* Product Description */}
                        <div className={`flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {selectedModel ? (
                                <ModelSpecifications 
                                    model={selectedModel} 
                                    getColumnName={getColumnName}
                                    product={product}
                                    isDarkMode={isDarkMode}
                                />
                            ) : (
                                <ProductDescription product={product} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Clear Model Selection Button */}
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
                {(product.models?.modelTables?.length ?? 0) > 0 && (
                    <div className={`mt-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden p-6`}>
                        <ProductModelsTable
                            modelTables={product.models?.modelTables ?? []}
                            productSlug={productSlug}
                            productLineSlug={productLineSlug}
                            onModelSelect={handleModelSelect}
                            selectedModel={selectedModel}
                        />
                    </div>
                )}

                {/* Call to Action */}
                <CallToAction isDarkMode={isDarkMode} />
            </div>
        </div>
    );
}

// Extracted Model Specifications component
function ModelSpecifications({ model, getColumnName, product, isDarkMode }: { 
    model: ModelRow;
    getColumnName: (key: string) => string;
    product: ProductWithModels;
    isDarkMode: boolean;
}) {
    return (
        <div>
            <h2 className={`text-2xl font-bold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                <span className={`inline-flex items-center justify-center p-2 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100/70'} mr-3`}>
                    <Cog8ToothIcon className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </span>
                Model {model.model} Specifications
            </h2>
            
            <div className={`p-4 rounded-lg mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <table className="w-full">
                    <tbody>
                        {Object.entries(model)
                            .filter(([key]) => !['model', 'image'].includes(key))
                            .map(([key, value], index) => (
                                <tr key={key} className={`border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} ${
                                    index % 2 === 0 
                                    ? isDarkMode ? 'bg-gray-700/80' : 'bg-gray-50/50' 
                                    : ''
                                }`}>
                                    <th className={`py-3 px-4 text-left font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                                        {getColumnName(key)}
                                    </th>
                                    <td className={`py-3 px-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        {typeof value === 'boolean'
                                            ? (value 
                                                ? <span className={`inline-flex items-center justify-center p-1 rounded-md ${isDarkMode ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-600'}`}>
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                  </span>
                                                : <span className={`inline-flex items-center justify-center p-1 rounded-md ${isDarkMode ? 'bg-gray-800/60 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
                                                    <XCircleIcon className="w-5 h-5" />
                                                  </span>)
                                            : value}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

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
    );
}

// Extracted Product Description component
function ProductDescription({ product }: { 
    product: ProductWithModels;
}) {
    return (
        <div className="prose prose-lg max-w-none">
            {product.description ? (
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {processRichText(product.description)}
                </ReactMarkdown>
            ) : (
                <p>Detailed product information coming soon. Please contact us for specifications and pricing.</p>
            )}
        </div>
    );
}

// Extracted Call to Action component
function CallToAction({ isDarkMode }: { isDarkMode: boolean }) {
    return (
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
    );
}