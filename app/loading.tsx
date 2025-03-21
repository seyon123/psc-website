"use client";

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function Loading() {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    // Set mounted to true after component mounts
    useEffect(() => {
        setMounted(true);
    }, []);

    // Determine if we're in dark mode - default to light if not mounted yet
    const isDarkMode = mounted && resolvedTheme === 'dark';

    return (
        <div className={`min-h-[70vh] flex flex-col items-center justify-center py-16 ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-white to-gray-50'
            }`}>
            <div className="container max-w-md mx-auto px-4 text-center">
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 md:p-12`}>
                    <div className="flex flex-col items-center">
                        <div className={`w-16 h-16 border-t-4 border-b-4 ${isDarkMode ? 'border-blue-500' : 'border-blue-600'
                            } rounded-full animate-spin mb-6`}></div>

                        <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            Loading Content
                        </h2>

                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Please wait while we prepare your content...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}