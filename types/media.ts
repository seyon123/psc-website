export type StrapiImage = {
    id: number;
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
        thumbnail?: StrapiImageFormat;
        small?: StrapiImageFormat;
        medium?: StrapiImageFormat;
        large?: StrapiImageFormat;
    };
};

export type StrapiImageFormat = {
    url: string;
    width: number;
    height: number;
};
