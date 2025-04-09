"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Placeholder image URL
const placeholderImage = "/placeholder-image.jpg";

// Helper function to get the full image URL
// Now includes check to prevent adding the base URL twice
const getImageUrl = (url?: string) => {
    if (!url) return placeholderImage;
    
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "";
    
    // Check if the URL already includes the base URL to prevent duplication
    if (url.startsWith("http") || url.startsWith(baseUrl)) {
        return url;
    }
    
    return `${baseUrl}${url}`;
};

// Define the common type for both products and parts
type Item = {
    name: string;
    image?: {
        url: string;
        width?: number;
        height?: number;
    }[];
};

// Extended type to support model images
type ModelImage = {
    model?: string | number;
    image?: string | string[];
};

type GalleryPageProps = {
    item: Item | null; // Allow item to be nullable in case it is not loaded yet
    modelImages?: ModelImage | null; // Optional model-specific images
};

export default function GalleryPage({ item, modelImages }: GalleryPageProps) {
    const [selectedImage, setSelectedImage] = useState<string>(placeholderImage);
    const [loading, setLoading] = useState<boolean>(true);
    const [zoomed, setZoomed] = useState<boolean>(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [allImages, setAllImages] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Prepare images array when the component mounts or when item/modelImages changes
    useEffect(() => {
        let imagesArray: string[] = [];
        
        // Check if modelImages is provided and has images
        if (modelImages) {
            // Handle single image string
            if (typeof modelImages.image === 'string') {
                imagesArray.push(getImageUrl(modelImages.image));
            } 
            // Handle array of image strings
            else if (Array.isArray(modelImages.image)) {
                imagesArray = modelImages.image.map(img => getImageUrl(img));
            }
        }
        // Fallback to item images if no model images or empty model images array
        else if (item && item.image && item.image.length > 0) {
            imagesArray = item.image.map(img => getImageUrl(img.url));
        }

        // If we still have no images, use placeholder
        if (imagesArray.length === 0) {
            imagesArray.push(placeholderImage);
        }

        setAllImages(imagesArray);
        setSelectedImage(imagesArray[0]);
        setLoading(false);
    }, [item, modelImages]);

    const handleImageClick = () => {
        setZoomed(!zoomed);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !zoomed) return;

        // Get container dimensions and position
        const rect = containerRef.current.getBoundingClientRect();

        // Calculate position as percentage values (0 to 1)
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Limit values to between 0 and 1
        const clampedX = Math.max(0, Math.min(1, x));
        const clampedY = Math.max(0, Math.min(1, y));

        setPosition({ x: clampedX, y: clampedY });
    };

    // Reset position when zoom is turned off
    useEffect(() => {
        if (!zoomed) {
            setPosition({ x: 0.5, y: 0.5 }); // Center position
        }
    }, [zoomed]);

    if (!item && !modelImages) {
        return <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <p className="text-gray-500">Loading...</p>
        </div>;
    }

    if (loading) {
        return <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <p className="text-gray-500">Loading images...</p>
        </div>;
    }

    // Calculate transform value for cursor-following zoom
    const transformValue = zoomed
        ? `scale(2.5) translate(${(0.5 - position.x) * 100}%, ${(0.5 - position.y) * 100}%)`
        : 'scale(1) translate(0%, 0%)';

    return (
        <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-start gap-6">
                {/* Thumbnail Gallery (only show if images exist and there's more than one) */}
                {allImages.length > 1 && (
                    <div className="flex lg:flex-col w-full lg:w-24 gap-4 p-2 overflow-x-auto lg:overflow-y-auto">
                        {allImages.map((img, index) => (
                            <div
                                key={index}
                                className={`relative rounded-lg w-20 h-20 flex-shrink-0 cursor-pointer shadow-md hover:scale-105 transition-all ${selectedImage === img ? 'ring-2 ring-blue-500' : ''
                                    }`}
                                onClick={() => setSelectedImage(img)}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Image
                                        src={img}
                                        alt={`${item?.name || 'Product'} - view ${index + 1}`}
                                        width={80}
                                        height={80}
                                        className="object-contain max-h-full max-w-full rounded-lg"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Main Image with zoom functionality */}
                <div
                    ref={containerRef}
                    className={`relative flex items-center justify-center w-full lg:flex-1 aspect-square shadow-lg rounded-lg bg-white overflow-hidden ${zoomed ? 'cursor-none' : 'cursor-zoom-in'
                        }`}
                    style={{ height: '400px' }}
                    onClick={handleImageClick}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => zoomed && setZoomed(false)}
                >
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                        <Image
                            src={selectedImage}
                            alt={item?.name || "Product image"}
                            fill={true}
                            className="object-contain transition-transform duration-100"
                            style={{ transform: transformValue }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>

                    {/* Zoom instruction icon */}
                    {!zoomed && (
                        <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M5 8a1 1 0 011-1h1V6a1 1 0 012 0v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 01-1-1z" />
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}

                    {/* Custom cursor indicator when zoomed */}
                    {zoomed && (
                        <div className="absolute w-6 h-6 border-2 border-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
                            style={{
                                left: `${position.x * 100}%`,
                                top: `${position.y * 100}%`,
                                backgroundColor: 'rgba(59, 130, 246, 0.2)'
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Image navigation buttons for mobile */}
            {allImages.length > 1 && (
                <div className="flex justify-center mt-4 lg:hidden">
                    <button
                        className="bg-gray-200 p-2 rounded-l-lg"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering zoom
                            const currentIndex = allImages.findIndex(img => img === selectedImage);
                            const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
                            setSelectedImage(allImages[prevIndex]);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <div className="px-4 py-2 bg-gray-200">
                        {allImages.findIndex(img => img === selectedImage) + 1} / {allImages.length}
                    </div>
                    <button
                        className="bg-gray-200 p-2 rounded-r-lg"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering zoom
                            const currentIndex = allImages.findIndex(img => img === selectedImage);
                            const nextIndex = (currentIndex + 1) % allImages.length;
                            setSelectedImage(allImages[nextIndex]);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}