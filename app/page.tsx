import { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/metadata";
import Hero from "@/components/Hero";
import ProductCategories from "@/components/ProductCategories";
import AboutSection from "@/components/AboutSection";
import CallToAction from "@/components/CallToAction";
import { getProductLines } from "@/lib/api";

export const metadata: Metadata = genMeta({
  // For the home page, we use the default title pattern set in lib/metadata.ts
  // without additional prefix, so it will just show the site name
  title: "Professional Pressure Washing Equipment & Solutions",
  description: "Pressure Systems Company provides high-quality pressure washing equipment and solutions for industrial and commercial applications since 1982.",
  path: "/"
});

export default async function Home() {
  // Fetch product lines server-side
  let productLines = [];
  
  try {
    productLines = await getProductLines();
  } catch (error) {
    console.error("Error fetching product lines:", error);
  }

  return (
    <>
      <Hero />
      <ProductCategories productLines={productLines} />
      <AboutSection />
      <CallToAction />
    </>
  );
}