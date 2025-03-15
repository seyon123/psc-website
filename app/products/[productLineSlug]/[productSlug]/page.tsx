import { getProductBySlug, getProductLines, processRichText } from "@/lib/api";
import { Product, ProductLine } from "@/types/products";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import GalleryPage from "@/components/GalleryPage";

type ProductPageProps = {
    params: {
        productLineSlug: string;
        productSlug: string;
    };
};

export default async function ProductPage({ params }: ProductPageProps) {
    const product = await getProductBySlug(params.productSlug);

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Product Title and Product Line */}
            <div className="mb-6">
                {/* Product Name */}
                <h1 className="text-4xl font-bold mb-2">{product.name}</h1>

                {/* Product Line Name */}
                <p className="text-lg text-gray-600">{product.product_line?.name}</p>
            </div>

            {/* Flexbox container to hold gallery and description */}
            <div className="flex flex-col lg:flex-row items-start gap-6 p-4">
                {/* Gallery (on larger screens, take up 1/2 of the width) */}
                <div className="flex-shrink-0 w-full lg:w-1/2">
                    <GalleryPage item={product} />
                </div>

                {/* Product Description */}
                <div className="flex-1 text-gray-600 prose prose-lg max-w-none mt-8 lg:mt-0">
                    {product.description ? (
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                            {processRichText(product.description)}
                        </ReactMarkdown>
                    ) : (
                        <p>No description available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Static generation for dynamic paths (Product Slugs)
export async function generateStaticParams() {
    const productLines = await getProductLines();

    const paths = productLines.flatMap((line: ProductLine) =>
        line.products.map((product: Product) => ({
            productLineSlug: line.slug,
            productSlug: product.slug,
        }))
    );

    return paths;
}
