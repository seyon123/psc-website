import { getPartBySlug, getPartCategories, processRichText } from "../../../../lib/api";
import { Part, PartCategory } from "@/types/parts";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import GalleryPage from "@/components/GalleryPage";



type PartPageProps = {
    params: {
        categorySlug: string;
        itemSlug: string;
    };
};

export default async function PartPage({ params }: PartPageProps) {
    const part = await getPartBySlug(params.itemSlug);

    if (!part) {
        return <div>Part not found</div>;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
                {/* Product Name */}
                <h1 className="text-4xl font-bold mb-2">{part.name}</h1>

                {/* Product Line Name */}
                <p className="text-lg text-gray-600">{part.category?.name}</p>
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-6 p-4">
                {/* Gallery (on larger screens, take up 1/2 of the width) */}
                <div className="flex-shrink-0 w-full lg:w-1/2">
                    <GalleryPage item={part} />
                </div>
                {/* Product Description */}
                <div className="flex-1 text-gray-600 prose prose-lg max-w-none mt-8 lg:mt-0">
                    {part.description ? (
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                            {processRichText(part.description)}
                        </ReactMarkdown>
                    ) : (
                        <p>No description available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Static generation for dynamic paths (Item Slugs)
export async function generateStaticParams() {
    const categories = await getPartCategories();

    const paths = categories.flatMap((category: PartCategory) =>
        category.parts.map((item: Part) => ({
            categorySlug: category.slug,
            itemSlug: item.slug,
        }))
    );

    return paths;
}
