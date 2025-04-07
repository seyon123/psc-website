"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { CheckCircleIcon, TrophyIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function AboutContent() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if we're in dark mode
  const isDarkMode = mounted && resolvedTheme === 'dark';

  // Don't render with theme-specific styles until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode
      ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200'
      : 'bg-gradient-to-b from-white to-gray-50 text-gray-700'
      }`}
    >
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              About Pressure Systems Company
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Since 1969, PSC Cleaning Systems Inc. now operating as PSC Pressure Systems Company Inc. have been the industry leader in pressure washing systems, providing high-quality equipment and solutions to industrial and commercial clients across the world.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-blue-600 opacity-5 pattern-diagonal-lines pattern-white pattern-bg-transparent pattern-size-4 pattern-opacity-10"></div>
      </section>

      {/* Our Mission */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 relative">
              <div className="relative h-80 w-full md:h-96 lg:h-[500px] overflow-hidden rounded-xl shadow-xl">
                <Image
                  src="/psc-entrance.png"
                  alt="Our mission"
                  fill
                  className="object-cover"
                  priority
                />
                <div className={`absolute inset-0 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-600'} opacity-20`}></div>
              </div>
              <div className={`absolute -bottom-6 -right-6 w-24 h-24 ${isDarkMode ? 'bg-blue-700' : 'bg-blue-500'} rounded-full flex items-center justify-center`}>
                <TrophyIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Our Mission</h2>
              <p className="mb-6">
                At Pressure Systems Company, our mission is to provide customers with the highest quality pressure washing equipment backed by unparalleled service and support. We strive to continually innovate and develop solutions that help our customers improve efficiency, reduce costs, and achieve better results.
              </p>
              <p>
                We&apos;re committed to maintaining the highest standards of quality, integrity, and environmental responsibility in everything we do. Our goal is to be not just a supplier, but a trusted partner in our customers&apos; success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our History - FIXED TIMELINE */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold mb-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Our History</h2>
          <div className="max-w-4xl mx-auto">
            {/* Timeline Container */}
            <div className="relative">
              {/* Timeline line - hidden on mobile, visible on md and up */}
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2 h-full w-1 bg-blue-600"></div>
              
              {/* Timeline points */}
              <div className="space-y-12">
                {/* 1982 - Modified for better mobile display */}
                <div className="relative flex flex-col md:flex-row">
                  <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
                    <div className="md:text-right">
                      <div className={`mb-2 text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>1982</div>
                      <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Company Founded</h3>
                      <p>Pressure Systems Company was established with a focus on providing quality equipment to industrial clients in the Northeastern United States.</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot - positioned differently on mobile vs desktop */}
                  <div className="flex md:absolute left-0 md:left-1/2 top-0 md:top-8 md:transform md:-translate-x-1/2 md:-translate-y-1/2 items-center mb-4 md:mb-0">
                    <div className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
                    {/* Mobile timeline line */}
                    <div className="md:hidden w-full h-1 ml-4 bg-blue-600"></div>
                  </div>
                  
                  <div className="md:w-1/2 md:pl-12">
                    <div className="md:hidden">
                      {/* Content is duplicated for mobile view but hidden on desktop */}
                    </div>
                  </div>
                </div>
                
                {/* 1995 */}
                <div className="relative flex flex-col md:flex-row">
                  <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
                    <div className="md:text-right md:hidden">
                      {/* Content is hidden on desktop but shown on mobile */}
                      <div className={`mb-2 text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>1995</div>
                      <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Expansion Across North America</h3>
                      <p>After successful growth, we expanded our operations to serve clients across all of North America, opening distribution centers in key regions.</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="flex md:absolute left-0 md:left-1/2 top-0 md:top-8 md:transform md:-translate-x-1/2 md:-translate-y-1/2 items-center mb-4 md:mb-0">
                    <div className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
                    {/* Mobile timeline line */}
                    <div className="md:hidden w-full h-1 ml-4 bg-blue-600"></div>
                  </div>
                  
                  <div className="md:w-1/2 md:pl-12">
                    <div className="hidden md:block">
                      <div className={`mb-2 text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>1995</div>
                      <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Expansion Across North America</h3>
                      <p>After successful growth, we expanded our operations to serve clients across all of North America, opening distribution centers in key regions.</p>
                    </div>
                    <div className="md:hidden">
                      {/* Empty div for mobile layout spacing */}
                    </div>
                  </div>
                </div>
                
                {/* 2008 */}
                <div className="relative flex flex-col md:flex-row">
                  <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
                    <div className="md:text-right">
                      <div className={`mb-2 text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>2008</div>
                      <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Eco-Friendly Innovation</h3>
                      <p>We launched our first line of environmentally friendly pressure washing systems, setting new industry standards for water conservation and waste management.</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="flex md:absolute left-0 md:left-1/2 top-0 md:top-8 md:transform md:-translate-x-1/2 md:-translate-y-1/2 items-center mb-4 md:mb-0">
                    <div className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
                    {/* Mobile timeline line */}
                    <div className="md:hidden w-full h-1 ml-4 bg-blue-600"></div>
                  </div>
                  
                  <div className="md:w-1/2 md:pl-12">
                    <div className="md:hidden">
                      {/* Empty div for mobile layout spacing */}
                    </div>
                  </div>
                </div>
                
                {/* 2020 */}
                <div className="relative flex flex-col md:flex-row">
                  <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
                    <div className="md:text-right md:hidden">
                      {/* Content is hidden on desktop but shown on mobile */}
                      <div className={`mb-2 text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>2020</div>
                      <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Digital Transformation</h3>
                      <p>We integrated smart technology into our equipment, allowing for remote monitoring, predictive maintenance, and enhanced performance analytics.</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="flex md:absolute left-0 md:left-1/2 top-0 md:top-8 md:transform md:-translate-x-1/2 md:-translate-y-1/2 items-center mb-4 md:mb-0">
                    <div className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
                    {/* Mobile timeline line */}
                    <div className="md:hidden w-full h-1 ml-4 bg-blue-600"></div>
                  </div>
                  
                  <div className="md:w-1/2 md:pl-12">
                    <div className="hidden md:block">
                      <div className={`mb-2 text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>2020</div>
                      <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Digital Transformation</h3>
                      <p>We integrated smart technology into our equipment, allowing for remote monitoring, predictive maintenance, and enhanced performance analytics.</p>
                    </div>
                    <div className="md:hidden">
                      {/* Empty div for mobile layout spacing */}
                    </div>
                  </div>
                </div>
                
                {/* Today */}
                <div className="relative flex flex-col md:flex-row">
                  <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
                    <div className="md:text-right">
                      <div className={`mb-2 text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Today</div>
                      <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Industry Leader</h3>
                      <p>Today, Pressure Systems Company stands as an industry leader with over 10,000 installed systems across North America, continuing to drive innovation and excellence in pressure washing equipment.</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="flex md:absolute left-0 md:left-1/2 top-0 md:top-8 md:transform md:-translate-x-1/2 md:-translate-y-1/2 items-center mb-4 md:mb-0">
                    <div className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
                    {/* Mobile timeline line */}
                    <div className="md:hidden w-full h-1 ml-4 bg-blue-600"></div>
                  </div>
                  
                  <div className="md:w-1/2 md:pl-12">
                    <div className="md:hidden">
                      {/* Empty div for mobile layout spacing */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold mb-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-lg`}>
              <div className={`inline-block p-3 rounded-full ${isDarkMode ? 'bg-blue-700' : 'bg-blue-100'} mb-4`}>
                <CheckCircleIcon className={`h-8 w-8 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Quality Equipment</h3>
              <p>We offer only the highest quality pressure washing equipment, built for durability, efficiency, and performance in demanding environments.</p>
            </div>
            
            <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-lg`}>
              <div className={`inline-block p-3 rounded-full ${isDarkMode ? 'bg-blue-700' : 'bg-blue-100'} mb-4`}>
                <UserGroupIcon className={`h-8 w-8 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Expert Support</h3>
              <p>Our team of experts provides comprehensive support, from helping you select the right equipment to offering technical assistance and maintenance services.</p>
            </div>
            
            <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-lg`}>
              <div className={`inline-block p-3 rounded-full ${isDarkMode ? 'bg-blue-700' : 'bg-blue-100'} mb-4`}>
                <ClockIcon className={`h-8 w-8 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Reliable Service</h3>
              <p>With over 55 years in the industry, we&apos;ve built a reputation for reliable service, quick response times, and commitment to customer satisfaction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold mb-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className={`rounded-lg overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="relative h-64 w-full">
                <Image
                  src="/psc-entrance.png"
                  alt="Jan Karlsen, President"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Jan Karlsen</h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>President</p>
                <p className="mb-4">With over 25 years of experience in industrial equipment manufacturing, Jan leads our company with a focus on innovation and customer satisfaction.</p>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className={`rounded-lg overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="relative h-64 w-full">
                <Image
                  src="/psc-entrance.png"
                  alt="Mark Cabrey, VP of Sales"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Mark Cabrey</h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>VP of Sales</p>
                <p className="mb-4">Mark brings a wealth of sales expertise, overseeing our product development and technological innovations to keep us at the forefront of the industry.</p>
              </div>
            </div>
            
            {/* Team Member 3 */}
            <div className={`rounded-lg overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="relative h-64 w-full">
                <Image
                  src="/psc-entrance.png"
                  alt="Rajagopal Ramanathan, VP of Manufacturing"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Rajagopal Ramanathan</h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>VP of Manufacturing</p>
                <p className="mb-4">Raja ensures our day-to-day operations run smoothly, managing our supply chain and manufacturing processes to deliver products of the highest quality.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Associations & Certifications */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
            {/* Association/Certification Logos */}            
            <div className={`h-24 w-full max-w-[180px] relative ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4 flex items-center justify-center`}>
              <Image
                src="/certifications/csa-certified.png"
                alt="CSA Certified"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
            
            <div className={`h-24 w-full max-w-[180px] relative ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4 flex items-center justify-center`}>
              <Image
                src="/certifications/ceta.png"
                alt="EPA Compliant"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
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
            <Link href="/products" className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition shadow-lg transform hover:-translate-y-1 duration-300">
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}