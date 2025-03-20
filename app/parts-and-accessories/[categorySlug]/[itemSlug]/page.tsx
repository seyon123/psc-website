import { getPartBySlug, getPartCategories, processRichText } from "../../../../lib/api";
import { Part, PartCategory } from "@/types/parts";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import GalleryPage from "@/components/GalleryPage";
import Link from "next/link";

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
            {/* Part Title and Category */}
            <div className="mb-6">
                {/* Part Name */}
                <h1 className="text-4xl font-bold mb-2">{part.name}</h1>

                {/* Part Category Name */}
                <p className="text-lg text-gray-600">{part.category?.name}</p>
            </div>

            {/* Flexbox container to hold gallery and description */}
            <div className="flex flex-col lg:flex-row items-start gap-6 p-4">
                {/* Gallery (on larger screens, take up 1/2 of the width) */}
                <div className="flex-shrink-0 w-full lg:w-1/2">
                    <GalleryPage item={part} />
                </div>

                {/* Part Description */}
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

            {/* Related Parts (if needed) */}
            {/* You could add related parts from the same category here */}

            {/* Call to Action */}
            <div className="mt-8 text-center">
                <p className="mb-4 text-lg">Interested in this part? Contact us for pricing and availability.</p>
                <Link href="/contact" className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-all inline-block">
                    Request Quote
                </Link>
            </div>
        </div>
    );
}

// Static generation for dynamic paths (Item Slugs)
export async function generateStaticParams() {
    try {
        const categories = await getPartCategories();

        // Add null check to prevent mapping over undefined
        if (!categories || !Array.isArray(categories)) {
            console.error('getPartCategories returned invalid data:', categories);
            return [];
        }

        const paths = categories.flatMap((category: PartCategory) => {
            // Add null check for parts array
            if (!category.parts || !Array.isArray(category.parts)) {
                console.error(`Category ${category.name} has invalid parts:`, category.parts);
                return [];
            }

            return category.parts.map((item: Part) => ({
                categorySlug: category.slug,
                itemSlug: item.slug,
            }));
        });

        return paths;
    } catch (error) {
        console.error('Error in generateStaticParams:', error);
        return [];
    }
}