import { getPartCategoryBySlug, getPartCategories, processRichText } from "../../../lib/api";
import { Part, PartCategory } from "@/types/parts";

import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

// Helper function to get the full image URL
const getImageUrl = (url?: string) => url ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}` : undefined;

// Placeholder image URL
const placeholderImage = "/placeholder-image.jpg";

export default async function PartsCategoryPage({ params }: { params: { categorySlug: string } }) {
    const category = await getPartCategoryBySlug(params.categorySlug);

    if (!category) {
        return <div>Category not found</div>;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-4">{category.name}</h1>

            {/* Category Image and Description */}
            {category.image && (
                <Image
                    src={getImageUrl(category.image.url) || placeholderImage}
                    alt={category.name}
                    width={category.image.width || 300}
                    height={category.image.height || 200}
                    className="rounded mb-4"
                />
            )}
            <div className="my-6 text-gray-600 prose prose-lg max-w-none">
                {category.description ? (
                    <ReactMarkdown
                        rehypePlugins={[rehypeRaw]}>
                        {processRichText(category.description)}
                    </ReactMarkdown>
                ) : (
                    "No description available."
                )}
            </div>

            {/* Parts List */}
            <h2 className="text-2xl font-semibold mb-4">Parts & Accessories</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.parts.map((part: Part) => (
                    <li key={part.slug} className="border p-4 rounded-lg shadow flex flex-col justify-between h-full">
                        <div>
                            <div className="w-full flex items-center justify-center aspect-square overflow-hidden rounded bg-gray-100">
                                {part.image && part.image.length > 0 && part.image[0].url && (
                                    <Image
                                        src={getImageUrl(part.image[0].url) || placeholderImage}
                                        alt={part.name}
                                        width={part.image[0].width || 300}
                                        height={part.image[0].height || 300}
                                        className="object-cover object-center"
                                    />
                                )}
                            </div>
                            <h3 className="text-xl mt-2 font-semibold">{part.name}</h3>
                            <div className="text-gray-600 mt-2 prose prose-lg max-w-none">
                                {part.description ? (
                                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                        {processRichText(part.description)}
                                    </ReactMarkdown>
                                ) : (
                                    "No description available."
                                )}
                            </div>
                        </div>
                        <div className="mt-auto">
                            <Link href={`/parts-and-accessories/${params.categorySlug}/${part.slug}`}>
                                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition cursor-pointer">
                                    View Part
                                </button>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Static generation for dynamic paths (Category Slugs)
export async function generateStaticParams() {
    const categories = await getPartCategories();

    // Return 'categorySlug' for each category
    return categories.map((category: PartCategory) => ({
        categorySlug: category.slug,
    }));
}