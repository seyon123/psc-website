'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                    <div className="container max-w-md mx-auto px-4 text-center">
                        <h2 className="text-2xl font-bold mb-4">
                            Something critical went wrong
                        </h2>
                        <p className="mb-6">
                            We&apos;re sorry, but there was a critical error in the application.
                        </p>
                        {error.digest && (
                            <p className="text-xs mb-6 text-gray-400">
                                Error ID: {error.digest}
                            </p>
                        )}
                        <button
                            onClick={reset}
                            className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}