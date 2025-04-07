import { getProductBySlug, processRichText } from "@/lib/api";
import { generateMetadata as genMeta } from "@/lib/metadata";
import { Metadata } from "next";
import { ProductWithModels } from "@/types/models";
import ProductDetail from "@/components/ProductDetail";

type ProductPageProps = {
  params: {
    productLineSlug: string;
    productSlug: string;
  };
  searchParams: {
    model?: string;
  };
};

// Generate metadata for the product page
export async function generateMetadata({ 
  params, 
  searchParams 
}: ProductPageProps): Promise<Metadata> {
  const { productSlug } = params;
  const { model } = searchParams;
  
  try {
    const product = await getProductBySlug(productSlug);
    
    if (!product) {
      return genMeta({
        title: "Product Not Found",
        description: "The product you're looking for could not be found.",
        path: `/products/${params.productLineSlug}/${productSlug}`
      });
    }
    
    // Base product metadata
    let title = product.name;
    let description = product.shortDescription || 
      (product.description ? 
        processRichText(product.description).substring(0, 160).replace(/<[^>]*>/g, '') : 
        `Professional grade ${product.name} by Pressure Systems Company`);
    
    // Add model information to metadata if a model is selected
    if (model && product.models?.modelTables) {
      // Find the model across all model tables
      let foundModel = null;
      product.models.modelTables.forEach(table => {
        const modelRow = table.rows.find(row => 
          row.model?.toString().toLowerCase() === model.toLowerCase()
        );
        if (modelRow) {
          foundModel = modelRow;
        }
      });
      
      if (foundModel) {
        title = `${product.name} - Model ${foundModel.model}`;
        description = `${description} - ${product.name} Model ${foundModel.model} specifications and details.`;
      }
    }
    
    // If product has an image, use it for OpenGraph
    let image = undefined;
    if (product.image && product.image.length > 0 && product.image[0].url) {
      image = `${process.env.NEXT_PUBLIC_STRAPI_URL}${product.image[0].url}`;
    }
    
    return genMeta({
      title,
      description,
      image,
      path: `/products/${params.productLineSlug}/${productSlug}${model ? `?model=${model}` : ''}`
    });
  } catch (error) {
    console.error("Error generating metadata:", error);
    return genMeta({
      title: "Product Information",
      description: "Explore our professional pressure washing equipment and solutions.",
      path: `/products/${params.productLineSlug}/${productSlug}`
    });
  }
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { productLineSlug, productSlug } = params;
  const { model } = searchParams;
  
  // Fetch product data server-side
  let product: ProductWithModels | null = null;
  
  try {
    product = await getProductBySlug(productSlug);
  } catch (error) {
    console.error("Error fetching product:", error);
  }
  
  return (
    <ProductDetail 
      product={product} 
      productLineSlug={productLineSlug} 
      productSlug={productSlug} 
      initialModelParam={model}
    />
  );
}