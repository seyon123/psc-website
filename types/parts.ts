import { StrapiImage } from "./media";


export type PartCategory = {
    slug: string;
    name: string;
    description?: string; // Rich text as a string
    image?: StrapiImage;
    parts: Part[];
};

export type Part = {
    slug: string;
    name: string;
    description?: string; // Rich text as a string
    shortDescription?: string;
    part_category: PartCategory;
    image?: StrapiImage[];
};
