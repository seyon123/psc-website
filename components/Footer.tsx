'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Image from 'next/image';
import {
    MoonIcon,
    SunIcon,
    PhoneIcon,
    EnvelopeIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';

import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
    const [mounted, setMounted] = useState(false);
    const { setTheme, resolvedTheme } = useTheme();

    // After mounting, we have access to the theme
    useEffect(() => setMounted(true), []);

    const toggleTheme = () => {
        const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };

    // Determine if it's actually dark mode for styling purposes
    // Use resolvedTheme instead of theme for more accurate detection
    const isDarkMode = mounted && resolvedTheme === 'dark';

    // If not mounted yet, return a skeleton footer without theme-specific styles
    if (!mounted) {
        return (
            <footer className="border-t border-gray-200">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Skeleton content */}
                        <div className="col-span-1 md:col-span-1"></div>
                        <div className="col-span-1"></div>
                        <div className="col-span-1"></div>
                        <div className="col-span-1"></div>
                    </div>
                </div>
            </footer>
        );
    }

    return (
        <footer className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t`}>
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="col-span-1 md:col-span-1 flex flex-col">
                        <div className="mb-4">
                            <Link href="/" className="flex items-center">
                                <Image
                                    src="/logo.png"
                                    alt="Pressure Systems Company Logo"
                                    width={150}
                                    height={50}
                                />
                            </Link>
                        </div>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4`}>
                            Providing high-quality pressure washing equipment and solutions since 1982. Serving industrial and commercial clients across North America.
                        </p>
                        {/* Theme Toggle Button */}
                        <div className="mt-auto">
                            <button
                                onClick={toggleTheme}
                                className={`inline-flex items-center justify-center p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                                    } focus:outline-none transition-colors cursor-pointer`}
                                aria-label="Toggle dark mode"
                            >
                                {isDarkMode ? (
                                    <div className="flex items-center">
                                        <SunIcon className="h-5 w-5 mr-2" />
                                        <span>Light Mode</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <MoonIcon className="h-5 w-5 mr-2" />
                                        <span>Dark Mode</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="col-span-1">
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Products</h3>
                        <ul className="space-y-2">
                            <li><Link href="/products" className={`${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>All Products</Link></li>
                            <li><Link href="/products/pressure-washers" className={`${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Pressure Washers</Link></li>
                            <li><Link href="/products/waste-water-treatment" className={`${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Waste Water Treatment</Link></li>
                            <li><Link href="/parts-and-accessories" className={`${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Parts & Accessories</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="col-span-1">
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Company</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className={`${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>About Us</Link></li>
                            <li><Link href="/contact" className={`${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Contact</Link></li>
                            <li><Link href="/services" className={`${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Services</Link></li>
                            <li><Link href="/blog" className={`${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Blog</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="col-span-1">
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Contact Us</h3>
                        <address className={`not-italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} space-y-2`}>
                            <div className="flex items-start">
                                <BuildingOfficeIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                                <p>3300 Steeles Ave. West #27<br />Concord, ON L4K 2Y4<br />Canada</p>
                            </div>
                            <div className="flex items-center mt-4">
                                <PhoneIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                                <a href="tel:+18002469689" className={`${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>
                                    1-800-246-9689
                                </a>
                            </div>
                            <div className="flex items-center mt-4">
                                <PhoneIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                                <a href="tel:+1905761133" className={`${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>
                                    (905) 761-1733
                                </a>
                            </div>
                            <div className="flex items-center">
                                <EnvelopeIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                                <a href="mailto:info@pscclean.com" className={`${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>
                                    info@pscclean.com
                                </a>
                            </div>
                        </address>
                    </div>
                </div>

                {/* Social Media and Copyright */}
                <div className={`mt-12 pt-8 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} flex flex-col md:flex-row justify-between items-center`}>
                    <div className="flex space-x-6 mb-4 md:mb-0">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                            className={`${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'} p-2 rounded-full hover:bg-gray-100 transition-colors`}
                            aria-label="Facebook">
                            <FaFacebook className="h-6 w-6" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                            className={`${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'} p-2 rounded-full hover:bg-gray-100 transition-colors`}
                            aria-label="Twitter">
                            <FaInstagram className="h-6 w-6" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                            className={`${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'} p-2 rounded-full hover:bg-gray-100 transition-colors`}
                            aria-label="LinkedIn">
                            <FaLinkedin className="h-6 w-6" />
                        </a>
                    </div>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                        © {new Date().getFullYear()} Pressure Systems Company, Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}