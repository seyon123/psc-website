import { getProductLines } from "@/lib/api";
import { generateMetadata as genMeta } from "@/lib/metadata";
import { Metadata } from "next";
import ProductLinesGrid from "@/components/ProductLinesGrid";

export const metadata: Metadata = genMeta({
  title: "Our Products",
  description: "Explore our complete range of professional pressure washing equipment and solutions for industrial and commercial applications.",
  path: "/products"
});

export default async function ProductsPage() {
  // Fetch product lines data server-side
  let productLines = [];
  
  try {
    productLines = await getProductLines();
  } catch (error) {
    console.error("Error fetching product lines:", error);
  }
  
  return <ProductLinesGrid productLines={productLines} />;
}