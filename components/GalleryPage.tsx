"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

// Placeholder image URL
const placeholderImage = "/placeholder-image.jpg";

// Helper function to get the full image URL
const getImageUrl = (url?: string) => url ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}` : placeholderImage;

// Define the common type for both products and parts
type Item = {
    name: string;
    image?: {
        url: string;
    }[];
};

type GalleryPageProps = {
    item: Item | null; // Allow item to be nullable in case it is not loaded yet
};

export default function GalleryPage({ item }: GalleryPageProps) {
    const [selectedImage, setSelectedImage] = useState<string>(placeholderImage);

    // Only update state if `item` and `item.image` are valid
    useEffect(() => {
        if (item && item.image && item.image.length > 0) {
            setSelectedImage(getImageUrl(item.image[0].url)); // Set first image if available
        }
    }, [item]); // Re-run the effect when `item` changes

    if (!item) {
        return <div>Loading...</div>; // Fallback UI if `item` is not passed
    }

    return (
        <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                {/* Thumbnail Gallery (only show if images exist) */}
                {item.image && item.image.length > 1 && (
                    <div className="flex w-full overflow-x-auto lg:flex-col lg:w-32 gap-4 p-2">
                        {item.image.map((img, index) => (
                            <div
                                key={index}
                                className="relative rounded-lg w-20 h-20 flex-shrink-0 cursor-pointer aspect-square lg:w-full shadow-md hover:scale-105 transition-all"
                                onClick={() => setSelectedImage(getImageUrl(img.url))}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Image
                                        src={getImageUrl(img.url)}
                                        alt={item.name}
                                        width={80}
                                        height={80}
                                        className="object-contain"
                                        unoptimized={true}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Main Image (either the selected image or the placeholder) */}
                <div className="relative w-full sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto aspect-square shadow-lg">
                    <Image
                        src={selectedImage}
                        alt={item.name}
                        layout="fill"
                        objectFit="contain"
                        className="rounded-lg"
                        unoptimized={true}
                    />
                </div>
            </div>
        </div>
    );
}
