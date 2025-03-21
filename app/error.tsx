'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
        setMounted(true);
    }, [error]);

    // Determine if we're in dark mode
    const isDarkMode = mounted && resolvedTheme === 'dark';

    return (
        <div className={`min-h-[70vh] flex items-center justify-center py-16 ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-white to-gray-50'
            }`}>
            <div className="container max-w-3xl mx-auto px-4 text-center">
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 md:p-12`}>
                    <div className="flex flex-col items-center mb-6">
                        <ExclamationTriangleIcon className={`h-16 w-16 ${isDarkMode ? 'text-yellow-500' : 'text-yellow-600'} mb-4`} />
                        <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            Something went wrong!
                        </h2>
                        <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            We apologize for the inconvenience. An unexpected error has occurred.
                        </p>

                        {error.digest && (
                            <p className={`text-xs mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Error ID: {error.digest}
                            </p>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={reset}
                                className={`inline-flex items-center justify-center ${isDarkMode
                                    ? 'bg-blue-700 hover:bg-blue-600'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                    } text-white py-3 px-8 rounded-lg transition shadow-lg transform hover:-translate-y-1 duration-300`}
                            >
                                <ArrowPathIcon className="h-5 w-5 mr-2" />
                                Try Again
                            </button>

                            <Link href="/" className={`inline-flex items-center justify-center ${isDarkMode
                                ? 'border-2 border-blue-700 text-blue-400 hover:bg-gray-700'
                                : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                                } py-3 px-8 rounded-lg transition shadow-lg transform hover:-translate-y-1 duration-300`}>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}