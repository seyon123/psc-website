import { getPartCategoryBySlug, getPartCategories, processRichText } from "../../../lib/api";
import { Part, PartCategory } from "@/types/parts";

import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";


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

            <Image
                src={category.image?.url || placeholderImage}
                alt={category.name}
                width={category.image?.width || 300}
                height={category.image?.height || 200}
                className="rounded mb-4"
            />
            <div className="text-gray-600 mb-6">{category.description ? (
                <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}>
                    {processRichText(category.description)}
                </ReactMarkdown>
            ) : (
                "No description available."
            )}</div>

            <h2 className="text-2xl font-semibold mb-4">Parts & Accessories</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.parts.map((part: Part) => (
                    <li key={part.slug} className="border p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                        <Link href={`/parts-and-accessories/${params.categorySlug}/${part.slug}`}>
                            <div className="cursor-pointer">
                                <Image
                                    src={part.image?.url || placeholderImage}
                                    alt={part.name}
                                    width={part.image?.width || 300}
                                    height={part.image?.height || 200}
                                    className="rounded mb-4"
                                />
                                <h3 className="text-xl font-semibold">{part.name}</h3>
                                <div className="text-gray-600">{part.description ? (
                                    <ReactMarkdown
                                        rehypePlugins={[rehypeRaw]}>
                                        {processRichText(part.description)}
                                    </ReactMarkdown>
                                ) : (
                                    "No description available."
                                )}</div>
                            </div>
                        </Link>
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
