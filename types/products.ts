import { StrapiImage } from "./media";


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
};