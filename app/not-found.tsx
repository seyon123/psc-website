"use client";

import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function NotFound() {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    // Set mounted to true after component mounts
    useEffect(() => {
        setMounted(true);
    }, []);

    // Determine if we're in dark mode
    const isDarkMode = mounted && resolvedTheme === 'dark';

    return (
        <div className={`min-h-[70vh] flex items-center justify-center py-16 ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-white to-gray-50'
            }`}>
            <div className="container max-w-3xl mx-auto px-4 text-center">
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 md:p-12`}>
                    <div className="mb-6">
                        <h1 className={`text-6xl font-bold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>404</h1>
                        <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            Page Not Found
                        </h2>
                        <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Sorry, the page you are looking for doesn&apos;t exist or has been moved.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/" className={`inline-flex items-center justify-center ${isDarkMode
                                ? 'bg-blue-700 hover:bg-blue-600'
                                : 'bg-blue-600 hover:bg-blue-700'
                                } text-white py-3 px-8 rounded-lg transition shadow-lg transform hover:-translate-y-1 duration-300`}>
                                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                                Back to Home
                            </Link>

                            <Link href="/contact" className={`inline-flex items-center justify-center ${isDarkMode
                                ? 'border-2 border-blue-700 text-blue-400 hover:bg-gray-700'
                                : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                                } py-3 px-8 rounded-lg transition shadow-lg transform hover:-translate-y-1 duration-300`}>
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}