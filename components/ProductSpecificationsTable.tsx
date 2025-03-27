'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { ModelSpecification } from '@/types/products';
import { ArrowUpIcon, ArrowDownIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import ModelComparisonModal from './ModelComparisonModal';
import { getSpecificationFields, formatFieldName, formatFieldValue } from '@/lib/product-spec-utils';

type ProductSpecificationsProps = {
    specifications?: ModelSpecification[];
};

const ProductSpecificationsTable: React.FC<ProductSpecificationsProps> = ({ specifications }) => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [isComparisonOpen, setIsComparisonOpen] = useState(false);
    const tableRef = React.useRef<HTMLDivElement>(null);

    // Set mounted to true after component mounts
    useEffect(() => {
        setMounted(true);
    }, []);

    // Check if table is overflowing (for mobile hint)
    useEffect(() => {
        if (tableRef.current) {
            const checkOverflow = () => {
                if (tableRef.current) {
                    setIsOverflowing(
                        tableRef.current.scrollWidth > tableRef.current.clientWidth
                    );
                }
            };

            checkOverflow();
            window.addEventListener('resize', checkOverflow);

            return () => {
                window.removeEventListener('resize', checkOverflow);
            };
        }
    }, [specifications, mounted]);

    // Determine if we're in dark mode
    const isDarkMode = mounted && resolvedTheme === 'dark';

    if (!specifications || specifications.length === 0) {
        return null;
    }

    // Get all relevant specification fields 
    const allKeys = getSpecificationFields(specifications);

    // Sort specifications
    const sortedSpecs = [...specifications].sort((a, b) => {
        if (!sortField) return 0;

        const valueA = a[sortField];
        const valueB = b[sortField];

        // Handle nullish values
        if (valueA === null || valueA === undefined) return sortDirection === 'asc' ? -1 : 1;
        if (valueB === null || valueB === undefined) return sortDirection === 'asc' ? 1 : -1;

        // Sort numbers numerically, strings alphabetically
        if (typeof valueA === 'number' && typeof valueB === 'number') {
            return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        }

        // Convert to strings for comparison
        const strA = String(valueA).toLowerCase();
        const strB = String(valueB).toLowerCase();

        if (sortDirection === 'asc') {
            return strA.localeCompare(strB);
        } else {
            return strB.localeCompare(strA);
        }
    });

    const handleSort = (field: string) => {
        if (sortField === field) {
            // Toggle direction if same field
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new field and default to ascending
            setSortField(field);
            setSortDirection('asc');
        }
    };

    return (
        <div className={`mt-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Model Specifications
                </h2>

                {specifications.length > 1 && (
                    <button
                        onClick={() => setIsComparisonOpen(true)}
                        className={`mt-2 sm:mt-0 cursor-pointer inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium
              ${isDarkMode
                                ? 'bg-blue-700 hover:bg-blue-600 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            } transition-colors`}
                    >
                        <ArrowsRightLeftIcon className="h-4 w-4 mr-1" />
                        Compare Models
                    </button>
                )}
            </div>

            {isOverflowing && (
                <div className={`mb-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Swipe horizontally to view all specifications
                </div>
            )}

            {/* Model Comparison Modal */}
            <ModelComparisonModal
                specifications={specifications}
                isOpen={isComparisonOpen}
                onClose={() => setIsComparisonOpen(false)}
            />

            <div
                ref={tableRef}
                className="overflow-x-auto"
            >
                <table className={`min-w-full border-collapse ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <thead>
                        <tr className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                            {allKeys.map(key => (
                                <th
                                    key={key}
                                    onClick={() => handleSort(key)}
                                    className={`
                    px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none
                    ${sortField === key ? (isDarkMode ? 'bg-gray-600' : 'bg-gray-100') : ''}
                    whitespace-nowrap
                  `}
                                >
                                    <div className="flex items-center">
                                        {formatFieldName(key)}
                                        {sortField === key && (
                                            <span className="ml-1">
                                                {sortDirection === 'asc' ? (
                                                    <ArrowUpIcon className="h-4 w-4" />
                                                ) : (
                                                    <ArrowDownIcon className="h-4 w-4" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {sortedSpecs.map((spec, index) => (
                            <tr
                                key={spec.id || index}
                                className={`
                  ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-800' : 'bg-white') : (isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50')}
                  hover:${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} transition-colors
                `}
                            >
                                {allKeys.map(key => (
                                    <td key={`${spec.id}-${key}`} className="px-4 py-3 text-sm whitespace-nowrap">
                                        {formatFieldValue(spec[key], key)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductSpecificationsTable;