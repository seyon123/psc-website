'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { ModelSpecification } from '@/types/products';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getSpecificationFields, formatFieldName, formatFieldValue } from '@/lib/product-spec-utils';

type ModelComparisonModalProps = {
    specifications?: ModelSpecification[];
    isOpen: boolean;
    onClose: () => void;
};

const ModelComparisonModal: React.FC<ModelComparisonModalProps> = ({
    specifications,
    isOpen,
    onClose
}) => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();
    const [selectedModels, setSelectedModels] = useState<string[]>([]);

    // Set mounted to true after component mounts
    useEffect(() => {
        setMounted(true);
    }, []);

    // Reset selected models when modal opens
    useEffect(() => {
        if (isOpen && specifications && specifications.length > 0) {
            // By default, select up to 3 models
            const initialSelected = specifications
                .slice(0, Math.min(3, specifications.length))
                .map(spec => spec.model_no);
            setSelectedModels(initialSelected);
        }
    }, [isOpen, specifications]);

    // Determine if we're in dark mode
    const isDarkMode = mounted && resolvedTheme === 'dark';

    if (!specifications || !isOpen) {
        return null;
    }

    // Get all relevant specification fields 
    const allKeys = getSpecificationFields(specifications);

    const toggleModelSelection = (modelNo: string) => {
        if (selectedModels.includes(modelNo)) {
            setSelectedModels(selectedModels.filter(m => m !== modelNo));
        } else {
            setSelectedModels([...selectedModels, modelNo]);
        }
    };

    // Get filteredSpecs based on selectedModels
    const filteredSpecs = specifications.filter(spec =>
        selectedModels.includes(spec.model_no)
    );

    // Check if we have differences for highlighting
    const hasDifferences = (field: string) => {
        if (field === 'model_no' || selectedModels.length < 2) return false;

        // Consider a field different if some models have values and others don't
        const hasValue = filteredSpecs.map(spec =>
            spec[field] !== undefined && spec[field] !== null && spec[field] !== ''
        );

        // If some models have values and others don't, it's a difference
        if (hasValue.some(Boolean) && hasValue.some(val => !val)) {
            return true;
        }

        // Get values for models that have this field
        const values = new Set();
        filteredSpecs.forEach(spec => {
            if (spec[field] !== undefined && spec[field] !== null && spec[field] !== '') {
                values.add(String(spec[field]));
            }
        });

        // It's a difference if we have more than one distinct value
        return values.size > 1;
    };

    return (
        <>
            {/* Modal Backdrop */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
                <div className="flex items-center justify-center min-h-screen p-4">
                    <div
                        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl transform transition-all ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className={`sticky top-0 z-10 p-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <div className="flex justify-between items-center">
                                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    Compare Models
                                </h2>
                                <button
                                    onClick={onClose}
                                    className={`p-2 cursor-pointer rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Model Selection */}
                            <div className="mt-4">
                                <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Select models to compare (up to 4):
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {specifications.map(spec => (
                                        <button
                                            key={spec.model_no}
                                            onClick={() => toggleModelSelection(spec.model_no)}
                                            className={`cursor-pointer px-3 py-1 text-sm font-medium rounded-full transition-colors ${selectedModels.includes(spec.model_no)
                                                ? isDarkMode
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-blue-500 text-white'
                                                : isDarkMode
                                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            disabled={!selectedModels.includes(spec.model_no) && selectedModels.length >= 4}
                                        >
                                            {spec.model_no}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="p-4">
                            {selectedModels.length === 0 ? (
                                <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Please select at least one model to compare
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className={`min-w-full border-collapse ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <thead>
                                            <tr className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                                    Specification
                                                </th>
                                                {filteredSpecs.map(spec => (
                                                    <th key={spec.model_no} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                                                        {spec.model_no}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {allKeys.map(key => {
                                                const isDifferent = hasDifferences(key);
                                                return (
                                                    <tr
                                                        key={key}
                                                        className={`
                              ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} 
                              ${isDifferent ? (isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50/50') : ''}
                              transition-colors
                            `}
                                                    >
                                                        <td className={`px-4 py-3 text-sm font-medium ${isDifferent ? (isDarkMode ? 'text-blue-300' : 'text-blue-700') : ''}`}>
                                                            {formatFieldName(key)}
                                                        </td>
                                                        {filteredSpecs.map(spec => {
                                                            const value = spec[key];
                                                            return (
                                                                <td
                                                                    key={`${spec.model_no}-${key}`}
                                                                    className={`px-4 py-3 text-sm whitespace-nowrap ${isDifferent ? (isDarkMode ? 'text-blue-300' : 'text-blue-700') : ''
                                                                        }`}
                                                                >
                                                                    {formatFieldValue(value, key)}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModelComparisonModal;