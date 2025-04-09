import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { 
  XMarkIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowsRightLeftIcon,
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
  const [mounted, setMounted] = useState(false);
  const [activeColumns, setActiveColumns] = useState<string[]>([]);
  const [showAllRows, setShowAllRows] = useState(false);
  const [differences, setDifferences] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const tableRef = useRef<HTMLTableElement>(null);
  
  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true);
    
    // Initialize with all columns active
    setActiveColumns([...columns]);
    
    // Find differences between models
    const diffs: Record<string, boolean> = {};
    
    // Filter out the "MODEL" column since it becomes the row headers
    const displayColumns = columns.filter(col => col.toLowerCase() !== 'model');
    
    displayColumns.forEach(column => {
      const propName = getPropertyName(column);
      const values = new Set();
      
      models.forEach(model => {
        values.add(JSON.stringify(model[propName]));
      });
      
      // If there is more than one unique value, it's a difference
      diffs[propName] = values.size > 1;
    });
    
    setDifferences(diffs);
  }, [columns, models]);

  const isDarkMode = mounted && resolvedTheme === 'dark';

  // Filter out the "MODEL" column since it becomes the row headers
  const displayColumns = columns.filter(col => col.toLowerCase() !== 'model');

  // Extract model names for column headers
  const modelNames = models.map(model => model.model?.toString() || 'Unknown');

  // Convert property names from column headers
  const getPropertyName = (col: string) => {
    return col.toLowerCase().replace(/\s/g, '_').replace(/[()."]/g, '');
  };
  
  // Toggle column visibility
  const toggleColumn = (column: string) => {
    if (activeColumns.includes(column)) {
      // Don't allow deactivating all columns
      if (activeColumns.length <= 1) return;
      
      setActiveColumns(activeColumns.filter(col => col !== column));
    } else {
      setActiveColumns([...activeColumns, column]);
    }
  };
  
  // Toggle showing only differences
  const toggleShowOnlyDifferences = () => {
    if (showAllRows) {
      // Show all rows
      setActiveColumns([...columns]);
    } else {
      // Show only differences
      setActiveColumns([
        ...columns.filter(col => {
          if (col.toLowerCase() === 'model') return true;
          return differences[getPropertyName(col)];
        })
      ]);
    }
    setShowAllRows(!showAllRows);
  };
  
  // Filter rows based on search term and active columns
  const filteredColumns = displayColumns.filter(column => {
    // Check if column is active
    if (!activeColumns.includes(column)) return false;
    
    // Check if column matches search term
    if (searchTerm && !column.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    return true;
  });

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'}`}>
      <div className="min-h-screen p-4 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center py-4 sticky top-0 z-10 bg-inherit">
          <h2 className={`text-2xl font-bold flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            <span className={`inline-flex items-center justify-center p-2 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100/70'} mr-3`}>
              <ArrowsRightLeftIcon className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </span>
            Model Comparison: {title}
          </h2>
          <div className="flex items-center space-x-3">
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
        </div>

        {/* Filters */}
        <div className={`mt-2 mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search specifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div className="flex items-center">
              <button
                onClick={toggleShowOnlyDifferences}
                className={`flex items-center px-4 py-2 rounded-lg cursor-pointer ${
                  !showAllRows
                    ? isDarkMode
                      ? 'bg-blue-700 text-white'
                      : 'bg-blue-600 text-white'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-200 text-gray-700'
                } transition-colors`}
              >
                {!showAllRows ? 'Show Only Differences' : 'Show All Specifications'}
              </button>
            </div>
          </div>
          
          {/* Column Toggle Section */}
          <div className="overflow-x-auto">
            <div className="text-sm font-medium mb-2">Toggle Columns:</div>
            <div className="flex flex-wrap gap-2">
              {displayColumns.map((column, index) => (
                <button
                  key={index}
                  onClick={() => toggleColumn(column)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors cursor-pointer ${
                    activeColumns.includes(column)
                      ? isDarkMode
                        ? 'bg-blue-700 text-white'
                        : 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {column.length > 20 ? column.substring(0, 18) + '...' : column}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-x-auto mt-2">
          <table ref={tableRef} className={`w-full border-collapse ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="py-4 px-6 text-left font-bold uppercase tracking-wider sticky left-0 z-10 bg-inherit">Specification</th>
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
              {filteredColumns.map((column, rowIndex) => {
                // Skip the "MODEL" column
                if (column.toLowerCase() === 'model') return null;
                
                // Convert column name to property name
                const propName = getPropertyName(column);
                
                // Format the display name - convert to title case
                const displayName = column
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, letter => letter.toUpperCase());
                
                // Highlight row if it shows differences
                const hasDifferences = differences[propName];
                
                return (
                  <tr 
                    key={rowIndex} 
                    className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} ${
                      hasDifferences
                        ? isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50/50'
                        : rowIndex % 2 === 0 
                          ? isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/70' 
                          : ''
                    } hover:${isDarkMode ? 'bg-gray-700/70' : 'bg-gray-100/70'}`}
                  >
                    <th className="py-4 px-6 text-left font-medium sticky left-0 z-10 bg-inherit">
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
                            : value !== undefined && value !== null ? value : '-'}
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