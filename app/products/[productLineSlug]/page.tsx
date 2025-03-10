import { getProductLineBySlug, getProductLines, processRichText } from "../../../lib/api";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

// Placeholder image URL
const placeholderImage = "/placeholder-image.jpg";

type ProductLine = {
    slug: string;
    name: string;
    shortDescription?: string;
    description?: any;
    image?: {
        url: string;
        width: number;
        height: number;
    };
    products: any[];
};

export default async function ProductLinePage({ params }: { params: { productLineSlug: string } }) {

    if (!params || !params.productLineSlug) {
        return <div>Loading...</div>;
    }

    // Fetch product line data only if the slug exists
    const productLine = await getProductLineBySlug(params.productLineSlug);

    if (!productLine) {
        return <div>Product line not found</div>;
    }
    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-4">{productLine.name}</h1>

            {/* Product Line Image and Description */}
            <Image
                src={productLine.image?.url || placeholderImage}
                alt={productLine.name}
                width={productLine.image?.width || 300}
                height={productLine.image?.height || 200}
                className="rounded mb-4"
            />
            <div className="mb-6 text-gray-600 prose prose-lg max-w-none">{productLine.description ? (
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{processRichText(productLine.description)}</ReactMarkdown>
            ) : (
                "No description available."
            )}</div>

            {/* Product List */}
            <h2 className="text-2xl font-semibold mb-4">Products</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productLine.products.map((product: any) => (
                    <li key={product.slug} className="border p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                        <Link href={`/products/${params.productLineSlug}/${product.slug}`}>
                            <div className="cursor-pointer">
                                <Image
                                    src={product.image?.url || placeholderImage}
                                    alt={product.name}
                                    width={product.image?.width || 300}
                                    height={product.image?.height || 200}
                                    className="rounded mb-4"
                                />
                                <h3 className="text-xl font-semibold">{product.name}</h3>
                                <div className="text-gray-600 prose prose-lg max-w-none">{product.description ? (
                                    <ReactMarkdown
                                        rehypePlugins={[rehypeRaw]}>{processRichText(product.description)}</ReactMarkdown>
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

// Static generation for dynamic paths (Product Line Slugs)
export async function generateStaticParams() {
    const productLines = await getProductLines();

    // Use 'productLineSlug' consistently
    return productLines.map((line: ProductLine) => ({
        productLineSlug: line.slug, // Return slug for each product line
    }));
}
