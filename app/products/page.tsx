import { getProductLines, processRichText } from "../../lib/api";
import Link from "next/link";
import Image from "next/image";
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
};

export default async function ProductLinesPage() {
    const productLines = await getProductLines();

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-4">Product Lines</h1>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productLines.map((line: ProductLine) => (
                    <li key={line.slug} className="border p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                        <Link href={`/products/${line.slug}`}>
                            <div className="cursor-pointer">
                                {/* Check if line.Image exists, if not use placeholder */}
                                <Image
                                    src={line.image?.url || placeholderImage}
                                    alt={line.name}
                                    width={line.image?.width || 300}
                                    height={line.image?.height || 200}
                                    className="rounded mb-4"
                                />
                                <h3 className="text-xl font-semibold">{line.name}</h3>
                                <div className="text-gray-600">{line.shortDescription ? (
                                    `${line.shortDescription}`) : ("")}</div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
