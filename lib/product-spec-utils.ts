import { ModelSpecification } from '@/types/products';

/**
 * Extract all unique field keys from specifications for column headers,
 * filtering out empty columns and internal fields
 */
export const getSpecificationFields = (specifications: ModelSpecification[]): string[] => {
    const keys = specifications.reduce((acc, spec) => {
        Object.keys(spec).forEach(key => {
            // Skip internal fields and fields that are already included
            if (!['id', 'createdAt', 'updatedAt', 'publishedAt', 'documentId'].includes(key) &&
                !acc.includes(key) &&
                spec[key] !== undefined &&
                spec[key] !== null &&
                spec[key] !== '') {
                acc.push(key);
            }
        });
        return acc;
    }, [] as string[]);

    // Sort keys based on importance
    return sortSpecificationFields(keys);
};

/**
 * Important keys for sorting specification fields
 */
export const importantSpecificationFields = [
    'model_no',
    'flow_gpm',
    'pressure_psi',
    'motor_hp',
    'voltage',
    'full_load_amps',
    'dimensions',
    'weight_lbs',
    'water_temp',
    'fuel_type',
    'recovery_rate'
];

/**
 * Sort specification fields based on importance
 */
export const sortSpecificationFields = (fields: string[]): string[] => {
    return [...fields].sort((a, b) => {
        const aIndex = importantSpecificationFields.indexOf(a);
        const bIndex = importantSpecificationFields.indexOf(b);

        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return a.localeCompare(b);
    });
};

/**
 * Format field names for display
 */
export const formatFieldName = (field: string): string => {
    // Handle special cases
    if (field === 'model_no') return 'MODEL NO.';
    if (field === 'flow_gpm') return 'FLOW (GPM)';
    if (field === 'pressure_psi') return 'PRESSURE (PSI)';
    if (field === 'motor_hp') return 'MOTOR H.P.';
    if (field === 'full_load_amps') return 'FULL LOAD AMPS';
    if (field === 'weight_lbs') return 'WEIGHT (LBS)';
    if (field === 'water_temp') return 'WATER TEMP';
    if (field === 'fuel_type') return 'FUEL TYPE';
    if (field === 'recovery_rate') return 'RECOVERY RATE';
    if (field === 'dimensions') return 'DIMENSIONS (L×W×H)';
    if (field === 'voltage') return 'VOLTAGE';

    // Default formatting: replace underscores with spaces and capitalize
    return field.replace(/_/g, ' ').toUpperCase();
};

/**
 * Format the display value for a given field
 */
export const formatFieldValue = (value: any, field: string): string => {
    if (value === undefined || value === null) return '-';

    // Format specific fields
    if (field === 'flow_gpm' && typeof value === 'number') return `${value} GPM`;
    if (field === 'pressure_psi' && typeof value === 'number') return `${value} PSI`;
    if (field === 'motor_hp' && typeof value === 'number') return `${value} HP`;
    if (field === 'weight_lbs' && typeof value === 'number') return `${value} lbs`;

    return String(value);
};