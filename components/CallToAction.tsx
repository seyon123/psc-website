"use client";

import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Work with Us?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Experience the difference of working with the industry leader in pressure washing equipment. Contact us today to discuss your needs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/contact" className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition shadow-lg transform hover:-translate-y-1 duration-300">
            Contact Us
          </Link>
          <Link href="/service" className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition shadow-lg transform hover:-translate-y-1 duration-300">
            Request Service
          </Link>
        </div>
      </div>
    </section>
  );
}