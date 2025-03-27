import { StrapiImage } from "./media";

export type ModelSpecification = {
    id: number;
    model_no: string;
    flow_gpm?: number;
    pressure_psi?: number;
    motor_hp?: number;
    voltage?: string;
    full_load_amps?: number;
    dimensions?: string;
    weight_lbs?: number;
    water_temp?: string;
    fuel_type?: string;
    recovery_rate?: string;
    // Additional custom fields to be added
    [key: string]: any; // Allow for custom fields
};

export type ProductLine = {
    slug: string;
    name: string;
    shortDescription?: string;
    description?: string; // Rich text as a string
    image?: StrapiImage;
    products: Product[];
};

export type Product = {
    slug: string;
    name: string;
    description?: string; // Rich text as a string
    shortDescription?: string;
    image?: StrapiImage[];
    product_line: ProductLine;
    model_specifications?: ModelSpecification[];
};