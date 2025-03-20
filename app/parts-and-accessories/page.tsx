import { getPartCategories, processRichText } from "../../lib/api";
import { PartCategory } from "@/types/parts";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

// Placeholder image URL
const placeholderImage = "/placeholder-image.jpg";

// Helper function to get the full image URL
const getImageUrl = (url?: string) => url ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}` : placeholderImage;

export default async function PartCategoriesPage() {
    const partCategories = await getPartCategories();

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-4">Parts & Accessories Categories</h1>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {partCategories.map((category: PartCategory) => (
                    <li key={category.slug} className="border p-4 rounded-lg shadow flex flex-col justify-between h-full">
                        <div>
                            <div className="w-full flex items-center justify-center aspect-square overflow-hidden rounded bg-gray-100">
                                <Image
                                    src={getImageUrl(category.image?.url)}
                                    alt={category.name}
                                    width={category.image?.width || 300}
                                    height={category.image?.height || 200}
                                    className="object-cover object-center"
                                />
                            </div>
                            <h3 className="text-xl mt-2 font-semibold">{category.name}</h3>

                            <div className="mt-2 text-gray-600 prose prose-lg max-w-none">
                                {category.description ? (
                                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                        {processRichText(category.description)}
                                    </ReactMarkdown>
                                ) : (
                                    "No description available."
                                )}
                            </div>
                        </div>

                        <div className="mt-auto">
                            <Link href={`/parts-and-accessories/${category.slug}`}>
                                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition cursor-pointer">
                                    View Parts
                                </button>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}