import { getProductBySlug, processRichText } from "@/lib/api";
import { generateMetadata as genMeta } from "@/lib/metadata";
import { Metadata } from "next";
import { ModelRow, ModelTable, ProductWithModels } from "@/types/models";
import ProductDetail from "@/components/ProductDetail";

type ProductPageProps = {
    params: Promise<{
      productLineSlug: string;
      productSlug: string;
    }>;
    searchParams: Promise<{
      model?: string;
    }>;
  };
  
  // Generate metadata for the product page
  export async function generateMetadata({ 
    params, 
    searchParams 
  }: ProductPageProps): Promise<Metadata> {
    // Await the promises
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
  
    const { productLineSlug, productSlug } = resolvedParams;
    const model = resolvedSearchParams.model;
    
    try {
      const product = await getProductBySlug(productSlug);
      
      if (!product) {
        return genMeta({
          title: "Product Not Found",
          description: "The product you're looking for could not be found.",
          path: `/products/${productLineSlug}/${productSlug}`
        });
      }
      
      // Base product metadata
      let title = product.name;
      let description = product.shortDescription || 
        (product.description ? 
          processRichText(product.description).substring(0, 160).replace(/<[^>]*>/g, '') : 
          `Professional grade ${product.name} by Pressure Systems Company`);
      
      // Default image from product
      let image = undefined;
      if (product.image && product.image.length > 0 && product.image[0].url) {
        image = `${process.env.NEXT_PUBLIC_STRAPI_URL}${product.image[0].url}`;
      }
      
      if (model && product.models?.modelTables) {
        // Explicitly type the foundModel and narrow the type of model
        let foundModel: ModelRow | null = null;
        
        product.models.modelTables.forEach((table: ModelTable) => {
          const modelRow = table.rows.find((row: ModelRow) => 
            row.model?.toString().toLowerCase() === model.toLowerCase()
          );
          
          if (modelRow) {
            foundModel = modelRow;
          }
        });
        
        if (foundModel) {
          // Update title to include model
          title = `${product.name} - Model ${foundModel.model}`;
          description = `${description} - ${product.name} Model ${foundModel.model} specifications and details.`;
          
          // Type-safe check for image
          if (foundModel.image && typeof foundModel.image === 'string') {
            image = `${process.env.NEXT_PUBLIC_STRAPI_URL}${foundModel.image}`;
          }
        }
      }
      
      return genMeta({
        title,
        description,
        image,
        path: `/products/${productLineSlug}/${productSlug}${model ? `?model=${model}` : ''}`
      });
    } catch (error) {
      console.error("Error generating metadata:", error);
      return genMeta({
        title: "Product Information",
        description: "Explore our professional pressure washing equipment and solutions.",
        path: `/products/${productLineSlug}/${productSlug}`
      });
    }
  }
  
  export default async function ProductPage({ params, searchParams }: ProductPageProps) {
    // Await the promises
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
  
    const { productLineSlug, productSlug } = resolvedParams;
    const model = resolvedSearchParams.model;
    
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