'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { 
  ArrowsRightLeftIcon, 
  DocumentDuplicateIcon,
  CheckCircleIcon,
  XCircleIcon,
  Cog8ToothIcon
} from '@heroicons/react/24/outline';
import { ModelRow, ModelTable } from '@/types/models';
import ModelComparison from './ModelComparison';


interface ProductModelsTableProps {
  modelTables: ModelTable[];
  productSlug: string;
  productLineSlug: string;
  onModelSelect?: (model: ModelRow) => void; // Callback to update main product image and specs
  selectedModel?: ModelRow | null; // Currently selected model
}

const ProductModelsTable: React.FC<ProductModelsTableProps> = ({ 
  modelTables, 
  onModelSelect,
  selectedModel
}) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  
  // Comparison state
  const [selectedModels, setSelectedModels] = useState<ModelRow[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [activeTable, setActiveTable] = useState<ModelTable | null>(null);
  
  // Max number of models that can be compared
  const MAX_COMPARE_MODELS = 4;

  // Toggle model selection for comparison
  const toggleModelSelection = (e: React.MouseEvent, model: ModelRow, tableData: ModelTable) => {
    e.stopPropagation(); // Prevent row click
    setActiveTable(tableData);
    
    if (selectedModels.some(m => m.model === model.model)) {
      // Remove from selection if already selected
      setSelectedModels(selectedModels.filter(m => m.model !== model.model));
    } else {
      // Add to selection if not at max limit
      if (selectedModels.length < MAX_COMPARE_MODELS) {
        setSelectedModels([...selectedModels, model]);
      }
    }
  };

  // Check if a model is selected for comparison
  const isModelSelected = (model: ModelRow) => {
    return selectedModels.some(m => m.model === model.model);
  };
  
  // Check if a model is the currently selected model for display
  const isCurrentlySelectedModel = (model: ModelRow) => {
    return selectedModel && model.model === selectedModel.model;
  };

  // Start comparison
  const startComparison = () => {
    if (selectedModels.length > 1 && activeTable) {
      setShowComparison(true);
    }
  };

  // Close comparison
  const closeComparison = () => {
    setShowComparison(false);
  };

  // Handle row click
  const handleRowClick = (model: ModelRow) => {
    // If there's a callback for model selection, use it
    if (onModelSelect) {
      onModelSelect(model);
    } else {
      // Otherwise update URL directly with the browser history API
      // This provides the smoothest experience with no refresh or scroll jump
      const modelStr = model.model?.toString().toLowerCase();
      if (modelStr && typeof window !== 'undefined') {
        // Create URL with model parameter
        const url = new URL(window.location.href);
        url.searchParams.set('model', modelStr);
        
        // Update browser history without navigation
        window.history.pushState({ path: url.toString() }, '', url.toString());
        
        // Find and select the model from available tables
        let modelToSelect: ModelRow | null = null;
        modelTables.forEach(table => {
          const foundModel = table.rows.find(row => 
            row.model?.toString().toLowerCase() === modelStr.toLowerCase()
          );
          if (foundModel) modelToSelect = foundModel;
        });
        
        // Update UI without navigation
        if (modelToSelect) {
          // Since we don't have direct access to the product page state,
          // we need to force a state update by simulating selection
          setTimeout(() => {
            const modelElement = document.querySelector(`[data-model="${modelStr}"]`);
            if (modelElement) modelElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      }
    }
  };

  if (!modelTables || modelTables.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          <span className={`inline-flex items-center justify-center p-1.5 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100/70'} mr-3`}>
            <Cog8ToothIcon className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </span>
          Available Models
        </h2>
        
        {/* Compare Models Button - Only show if at least 2 models are selected */}
        {selectedModels.length >= 2 && (
          <button 
            onClick={startComparison}
            className={`flex items-center px-4 py-2 rounded-lg ${
              isDarkMode 
                ? 'bg-blue-700 hover:bg-blue-600' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-colors cursor-pointer`}
          >
            <ArrowsRightLeftIcon className="h-5 w-5 mr-2" />
            Compare {selectedModels.length} Models
          </button>
        )}
      </div>

      {modelTables.map((table, tableIndex) => (
        <div 
          key={tableIndex} 
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden transition-all duration-300 mb-6`}
        >
          {/* Table Content - Always visible */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <th className="w-12 px-2 py-3"></th>
                  {table.columns.map((column, colIndex) => (
                    <th 
                      key={colIndex}
                      className={`px-4 py-3 text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      } uppercase tracking-wider whitespace-nowrap text-center`}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {table.rows.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex}
                    onClick={() => handleRowClick(row)}
                    data-model={row.model?.toString().toLowerCase()}
                    className={`
                      ${rowIndex % 2 === 0
                        ? isDarkMode ? 'bg-gray-800' : 'bg-white'
                        : isDarkMode ? 'bg-gray-750' : 'bg-gray-50'
                      } 
                      ${isCurrentlySelectedModel(row) 
                        ? isDarkMode ? 'bg-blue-900/30 border-l-4 border-blue-500' : 'bg-blue-50 border-l-4 border-blue-500' 
                        : ''
                      }
                      hover:bg-opacity-90 transition-colors cursor-pointer text-center
                      ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'}`
                    }
                  >
                    {/* Compare checkbox */}
                    <td className="w-12 px-2 py-3">
                      <button
                        onClick={(e) => toggleModelSelection(e, row, table)}
                        className={`
                          p-2 rounded-full 
                          transition-all duration-200 
                          ${isModelSelected(row)
                            ? isDarkMode
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-600 text-white'
                            : isDarkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                          ${selectedModels.length >= MAX_COMPARE_MODELS && !isModelSelected(row)
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'cursor-pointer'
                          }
                        `}
                        disabled={selectedModels.length >= MAX_COMPARE_MODELS && !isModelSelected(row)}
                        title={isModelSelected(row) ? "Remove from comparison" : "Add to comparison"}
                      >
                        <DocumentDuplicateIcon className="h-4 w-4" />
                      </button>
                    </td>
                    
                    {/* Model data */}
                    {table.columns.map((column, cellIndex) => {
                      const columnKey = column.toLowerCase().replace(/\s/g, '_').replace(/[()."]/g, '');
                      const cellValue = row[columnKey];
                      return (
                        <td 
                          key={cellIndex}
                          className={`px-4 py-3 text-sm ${
                            isCurrentlySelectedModel(row)
                              ? isDarkMode ? 'text-blue-300 font-medium' : 'text-blue-700 font-medium'
                              : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          } whitespace-nowrap`}
                        >
                          {typeof cellValue === 'boolean' 
                            ? (cellValue 
                              ? <span className={`inline-flex items-center justify-center p-0.5 rounded-md ${isDarkMode ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-600'}`}>
                                  <CheckCircleIcon className="w-4 h-4" />
                                </span>
                              : <span className={`inline-flex items-center justify-center p-0.5 rounded-md ${isDarkMode ? 'bg-gray-800/60 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
                                  <XCircleIcon className="w-4 h-4" />
                                </span>)
                            : cellValue ?? '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Comparison Modal */}
      {showComparison && activeTable && (
        <ModelComparison 
          models={selectedModels} 
          columns={activeTable.columns}
          title={activeTable.title}
          onClose={closeComparison}
        />
      )}
    </div>
  );
};

export default ProductModelsTable;