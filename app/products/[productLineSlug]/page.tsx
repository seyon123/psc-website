import { getProductLineBySlug, processRichText } from "@/lib/api";
import { generateMetadata as genMeta } from "@/lib/metadata";
import { Metadata } from "next";
import ProductLineDetail from "@/components/ProductLineDetail";

type ProductLinePageProps = {
  params: {
    productLineSlug: string;
  };
};

// Generate metadata for the product line page
export async function generateMetadata({ params }: ProductLinePageProps): Promise<Metadata> {
  const { productLineSlug } = params;
  
  try {
    const productLine = await getProductLineBySlug(productLineSlug);
    
    if (!productLine) {
      return genMeta({
        title: "Product Line Not Found",
        description: "The product line you're looking for could not be found.",
        path: `/products/${productLineSlug}`
      });
    }
    
    // Process description for metadata
    const description = productLine.shortDescription || 
      (productLine.description ? 
        processRichText(productLine.description).substring(0, 160).replace(/<[^>]*>/g, '') : 
        `Explore our range of ${productLine.name} products designed for professional cleaning applications.`);
    
    // If product line has an image, use it for OpenGraph
    let image = undefined;
    if (productLine.image?.url) {
      image = `${process.env.NEXT_PUBLIC_STRAPI_URL}${productLine.image.url}`;
    }
    
    return genMeta({
      title: productLine.name,
      description,
      image,
      path: `/products/${productLineSlug}`
    });
  } catch (error) {
    console.error("Error generating metadata:", error);
    return genMeta({
      title: "Product Line",
      description: "Explore our professional pressure washing equipment and solutions.",
      path: `/products/${productLineSlug}`
    });
  }
}

export default async function ProductLinePage({ params }: ProductLinePageProps) {
  const { productLineSlug } = params;
  
  // Fetch product line data server-side
  let productLine = null;
  
  try {
    productLine = await getProductLineBySlug(productLineSlug);
  } catch (error) {
    console.error("Error fetching product line:", error);
  }
  
  return <ProductLineDetail productLine={productLine} productLineSlug={productLineSlug} />;
}