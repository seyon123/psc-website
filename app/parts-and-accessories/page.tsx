import { getPartCategories, processRichText } from "../../lib/api";
import { PartCategory } from "@/types/parts";

import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";


const placeholderImage = "/placeholder-image.jpg";

export default async function PartCategoriesPage() {
    const partCategories = await getPartCategories();

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-4">Parts & Accessories</h1>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {partCategories.map((category: PartCategory) => (
                    <li key={category.slug} className="border p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                        <Link href={`/parts-and-accessories/${category.slug}`}>
                            <div className="cursor-pointer">
                                <Image
                                    src={category.image?.url || placeholderImage}
                                    alt={category.name}
                                    width={category.image?.width || 300}
                                    height={category.image?.height || 200}
                                    className="rounded mb-4"
                                />
                                <h3 className="text-xl font-semibold">{category.name}</h3>

                                {/* Use the extracted function */}
                                <div className="text-gray-600">
                                    {category.description ? (
                                        <ReactMarkdown
                                            rehypePlugins={[rehypeRaw]}>
                                            {processRichText(category.description)}
                                        </ReactMarkdown>
                                    ) : (
                                        "No description available."
                                    )}
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
