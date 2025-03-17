import { getProductLineBySlug, getProductLines, processRichText } from "@/lib/api";
import { Product, ProductLine } from "@/types/products";

import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

// Helper function to get the full image URL
const getImageUrl = (url?: string) => url ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}` : undefined;

export default async function ProductLinePage({ params }: { params: { productLineSlug: string } }) {
    if (!params || !params.productLineSlug) {
        return <div>Loading...</div>;
    }

    const productLine = await getProductLineBySlug(params.productLineSlug);

    if (!productLine) {
        return <div>Product line not found</div>;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-4">{productLine.name}</h1>

            {/* Product Line Image and Description */}
            {productLine.image && (
                <Image
                    src={getImageUrl(productLine.image.url) || ""}
                    alt={productLine.name}
                    width={productLine.image.width || 300}
                    height={productLine.image.height || 200}
                    className="rounded mb-4"
                />
            )}
            <div className="my-6 text-gray-600 prose prose-lg max-w-none">
                {productLine.description ? (
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                        {processRichText(productLine.description)}
                    </ReactMarkdown>
                ) : (
                    "No description available."
                )}
            </div>

            {/* Product List */}
            <h2 className="text-2xl font-semibold mb-4">Products</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productLine.products.map((product: Product) => (
                    <li key={product.slug} className="border p-4 rounded-lg shadow flex flex-col justify-between h-full">
                        <div>
                            <div className="w-full flex items-center justify-center aspect-square overflow-hidden rounded bg-gray-100">
                                {product.image && product.image.length > 0 && product.image[0].url && (
                                    <Image
                                        src={getImageUrl(product.image[0].url) || ""}
                                        alt={product.name}
                                        width={product.image[0].width || 300}
                                        height={product.image[0].height || 300}
                                        className="object-cover object-center"
                                    />
                                )}
                            </div>
                            <h3 className="text-xl mt-2 font-semibold">{product.name}</h3>
                            <div className="text-gray-600 mt-2 prose prose-lg max-w-none">
                                {product.description ? (
                                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                        {processRichText(product.description)}
                                    </ReactMarkdown>
                                ) : (
                                    "No description available."
                                )}
                            </div>
                        </div>
                        <div className="mt-auto">
                            <Link href={`/products/${params.productLineSlug}/${product.slug}`}>
                                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition cursor-pointer">
                                    View Product
                                </button>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Static generation for dynamic paths (Product Line Slugs)
export async function generateStaticParams() {
    const productLines = await getProductLines();

    return productLines.map((line: ProductLine) => ({
        productLineSlug: line.slug,
    }));
}
