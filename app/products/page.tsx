import { getProductLines, processRichText } from "@/lib/api";
import { ProductLine } from "@/types/products";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

// Placeholder image URL
const placeholderImage = "/placeholder-image.jpg";

// Helper function to get the full image URL
const getImageUrl = (url?: string) => url ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}` : placeholderImage;


export default async function ProductLinesPage() {
    const productLines = await getProductLines();

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-4">Product Categories</h1>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productLines.map((line: ProductLine) => (
                    <li key={line.slug} className="border p-4 rounded-lg shadow flex flex-col justify-between h-full">
                        <div >
                            <div className="w-full flex items-center justify-center aspect-square overflow-hidden rounded bg-gray-100">
                                <Image
                                    src={getImageUrl(line.image?.url)}
                                    alt={line.name}
                                    width={line.image?.width || 300}
                                    height={line.image?.height || 200}
                                    className="object-cover object-center"
                                />
                            </div>
                            <h3 className="text-xl mt-2  font-semibold">{line.name}</h3>

                            <div className=" mt-2 text-gray-600 prose prose-lg max-w-none">
                                {line.description ? (
                                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                        {processRichText(line.description)}
                                    </ReactMarkdown>
                                ) : (
                                    "No description available."
                                )}
                            </div>
                        </div>

                        <div className="mt-auto">
                            <Link href={`/products/${line.slug}`}>
                                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition cursor-pointer">
                                    View Products
                                </button>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
