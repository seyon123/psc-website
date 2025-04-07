import { generateMetadata as genMeta } from "@/lib/metadata";
import { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = genMeta({
  title: "About Us",
  description: "Learn about Pressure Systems Company, a leader in professional pressure washing equipment since 1969. Discover our story, mission, and commitment to quality and service.",
  path: "/about"
});

export default function AboutPage() {
  return <AboutContent />;
}