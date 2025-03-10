import { getProductLineBySlug, getProductLines, processRichText } from "../../../../lib/api";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

// Placeholder image URL
const placeholderImage = "/placeholder-image.jpg";

type ProductPageProps = {
    params: {
        productLineSlug: string;
        productSlug: string;
    };
};

export default async function ProductPage({ params }: ProductPageProps) {
    // Fetch the product line data based on productLineSlug
    const productLine = await getProductLineBySlug(params.productLineSlug);
    // Find the product based on the slug
    const product = productLine?.products.find((prod: any) => prod.slug === params.productSlug);

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold mb-6">{product.name}</h1>

            {/* Product Info Section with Image on the Left and Description on the Right */}
            <div className="flex flex-col md:flex-row mb-8 gap-8">
                {/* Product Image Section */}
                <div className="w-full md:w-1/2 flex justify-center mb-4 md:mb-0">
                    <div className="relative w-full h-96">
                        <Image
                            src={product.image?.url || placeholderImage}
                            alt={product.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                </div>

                {/* Product Description Section */}
                <div className="w-full md:w-1/2">
                    <div className="text-gray-600 prose prose-lg max-w-none">
                        {product.description ? (
                            <ReactMarkdown
                                rehypePlugins={[rehypeRaw]}>
                                {processRichText(product.description)}
                            </ReactMarkdown>
                        ) : (
                            <p>No description available.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Images Gallery Section (Thumbnail Images) */}
            <div className="flex gap-4 mb-8 overflow-x-auto">
                {product.images?.map((img: any, index: number) => (
                    <div key={index} className="relative w-32 h-32 flex-shrink-0">
                        <Image
                            src={img.url || placeholderImage}
                            alt={product.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg shadow-md cursor-pointer hover:scale-105 transition-all"
                        />
                    </div>
                ))}
            </div>

            {/* More Information Section (Optional) */}
            <div className="bg-gray-50 py-8 px-4 rounded-lg shadow-lg mt-8">
                <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                <ul className="list-disc pl-5 space-y-2">
                    {product.features?.map((feature: string, index: number) => (
                        <li key={index} className="text-gray-600">{feature}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

// Static generation for dynamic paths (Product Slugs)
export async function generateStaticParams() {
    const productLines = await getProductLines();

    const paths = productLines.flatMap((line: any) =>
        line.products.map((product: any) => ({
            productLineSlug: line.slug, // Use 'productLineSlug' for the product line
            productSlug: product.slug, // Use 'productSlug' for the product
        }))
    );

    return paths;
}
