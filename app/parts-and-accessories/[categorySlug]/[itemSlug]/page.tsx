import { getPartCategoryBySlug, getPartCategories, processRichText } from "../../../../lib/api";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";


// Placeholder image URL
const placeholderImage = "/placeholder-image.jpg";

type PartPageProps = {
    params: {
        categorySlug: string;
        itemSlug: string;
    };
};

export default async function PartPage({ params }: PartPageProps) {
    const category = await getPartCategoryBySlug(params.categorySlug);
    const part = category?.parts.find((item: any) => item.slug === params.itemSlug);

    if (!part) {
        return <div>Part not found</div>;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-4">{part.name}</h1>

            <Image
                src={part.image?.url || placeholderImage}
                alt={part.imame}
                width={part.image?.width || 300}
                height={part.image?.height || 200}
                className="rounded mb-4"
            />
            <div className="text-gray-600">{part.description ? (
                <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}>
                    {processRichText(part.description)}
                </ReactMarkdown>
            ) : (
                "No description available."
            )}</div>
        </div>
    );
}

// Static generation for dynamic paths (Item Slugs)
export async function generateStaticParams() {
    const categories = await getPartCategories();

    const paths = categories.flatMap((category: any) =>
        category.parts.map((item: any) => ({
            categorySlug: category.slug,
            itemSlug: item.slug,
        }))
    );

    return paths;
}
