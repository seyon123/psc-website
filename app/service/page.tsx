import { generateMetadata as genMeta } from "@/lib/metadata";
import { Metadata } from "next";
import ServiceRequestForm from "@/components/ServiceRequestForm";

export const metadata: Metadata = genMeta({
  title: "Request Service",
  description: "Request service for your pressure washing equipment. Our factory-trained technicians provide maintenance, repairs, and emergency service for all equipment models.",
  path: "/service"
});

export default function ServicePage() {
  return <ServiceRequestForm />;
}