import React from 'react';
import { useTheme } from 'next-themes';
import { 
  XMarkIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowsRightLeftIcon 
} from '@heroicons/react/24/outline';
import { ModelRow } from '@/types/models';

interface ModelComparisonProps {
  models: ModelRow[];
  columns: string[];
  title: string;
  onClose: () => void;
}

const ModelComparison: React.FC<ModelComparisonProps> = ({ 
  models, 
  columns,
  title,
  onClose 
}) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  // Filter out the "MODEL" column since it becomes the row headers
  const displayColumns = columns.filter(col => col.toLowerCase() !== 'model');

  // Extract model names for column headers
  const modelNames = models.map(model => model.model?.toString() || 'Unknown');

  // Convert property names from column headers
  const getPropertyName = (col: string) => {
    return col.toLowerCase().replace(/\s/g, '_').replace(/[()."]/g, '');
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'}`}>
      <div className="min-h-screen p-4 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center py-4 sticky top-0 z-10">
          <h2 className={`text-2xl font-bold flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            <span className={`inline-flex items-center justify-center p-2 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100/70'} mr-3`}>
              <ArrowsRightLeftIcon className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </span>
            Model Comparison: {title}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            } transition-colors cursor-pointer`}
            aria-label="Close comparison"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-x-auto mt-6">
          <table className={`w-full border-collapse ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="py-4 px-6 text-left font-bold uppercase tracking-wider">Specification</th>
                {modelNames.map((model, index) => (
                  <th key={index} className="py-4 px-6 text-center font-bold">
                    <span className={`text-lg ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {model}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Generate rows for each specification */}
              {displayColumns.map((column, rowIndex) => {
                // Convert column name to property name
                const propName = getPropertyName(column);
                
                // Format the display name - convert to title case
                const displayName = column
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, letter => letter.toUpperCase());
                
                return (
                  <tr 
                    key={rowIndex} 
                    className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} ${
                      rowIndex % 2 === 0 
                        ? isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/70' 
                        : ''
                    }`}
                  >
                    <th className="py-4 px-6 text-left font-medium">
                      {displayName}
                    </th>
                    {models.map((model, colIndex) => {
                      const value = model[propName];
                      return (
                        <td key={colIndex} className="py-4 px-6 text-center">
                          {typeof value === 'boolean'
                            ? (value 
                                ? <span className={`inline-flex items-center justify-center p-0.5 rounded-md ${isDarkMode ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-600'}`}>
                                    <CheckCircleIcon className="w-4 h-4" />
                                  </span>
                                : <span className={`inline-flex items-center justify-center p-0.5 rounded-md ${isDarkMode ? 'bg-gray-800/60 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
                                    <XCircleIcon className="w-4 h-4" />
                                  </span>)
                            : value ?? '-'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ModelComparison;