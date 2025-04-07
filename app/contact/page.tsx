import { generateMetadata as genMeta } from "@/lib/metadata";
import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = genMeta({
  title: "Contact Us",
  description: "Contact Pressure Systems Company for information about our products, technical support, or to request a quote. Our team of experts is ready to assist you.",
  path: "/contact"
});

export default function ContactPage() {
  return <ContactForm />;
}