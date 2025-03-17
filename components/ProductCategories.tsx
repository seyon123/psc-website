'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProductLines } from "@/lib/api";
import { ProductLine } from "@/types/products";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

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
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_SMALL); // Default to 1 item per page

    useEffect(() => {
        // Fetch product lines when the component is mounted
        const fetchProductLines = async () => {
            const data = await getProductLines();
            setProductLines(data);
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
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <section className="container mx-auto py-8 px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
                Explore Our Product Categories
            </h2>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {currentProductLines.map((productLine: ProductLine) => (
                    <li key={productLine.slug} className="border p-4 rounded-lg shadow flex flex-col justify-between h-full">
                        <div>
                            <div className="w-full flex items-center justify-center aspect-square overflow-hidden rounded bg-gray-100">
                                <Image
                                    src={getImageUrl(productLine.image?.url)}
                                    alt={productLine.name}
                                    width={300} // Adjust as needed
                                    height={300} // Adjust as needed
                                    className="object-cover object-center"
                                />
                            </div>
                            <h3 className="text-xl mt-2 text-center font-semibold">{productLine.name}</h3>
                        </div>

                        <div className="mt-2">
                            <Link href={`/products/${productLine.slug}`}>
                                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition cursor-pointer">
                                    View {productLine.name}
                                </button>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-8">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="bg-blue-500 cursor-pointer disabled:cursor-not-allowed text-white py-2 px-4 rounded-l hover:bg-blue-600 transition disabled:bg-gray-400 flex items-center"
                >
                    <ChevronLeftIcon className="w-5 h-5 mr-2" />
                    Previous
                </button>
                <span className="px-4 py-2 text-xl">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="bg-blue-500 cursor-pointer disabled:cursor-not-allowed text-white py-2 px-4 rounded-r hover:bg-blue-600 transition disabled:bg-gray-400 flex items-center"
                >
                    Next
                    <ChevronRightIcon className="w-5 h-5 ml-2" />
                </button>
            </div>
        </section>
    );
}
