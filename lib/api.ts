import axios from "axios";

const API_URL = (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337") + "/api";

export const fetchAPI = async (path: string) => {
    try {
        const response = await axios.get(`${API_URL}${path}`);
        return response.data;
    } catch (error) {
        console.error("API fetch error:", error);
        return null;
    }
};

// Products API Functions
export async function getProductLines() {
    try {
        const response = await fetch(API_URL + "/product-lines?populate[image][populate]=*&populate[products][populate]=*");

        if (!response.ok) {
            throw new Error(`Failed to fetch product lines: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched product lines:", data);
        return data.data || [];
    } catch (error) {
        console.error("Error fetching product lines:", error);
        return [];
    }
}


export async function getProductLineBySlug(slug: string) {
    try {
        // Correct query syntax to populate `image` for the product line and `image` for products
        const response = await fetch(API_URL + `/product-lines?filters[slug][$eq]=${slug}&populate=image&populate=products.image`);

        if (!response.ok) {
            throw new Error(`Failed to fetch product line: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched product line:", data);
        return data.data[0]; // Return the first result, assuming slugs are unique
    } catch (error) {
        console.error("Error fetching product line:", error);
        return null;
    }
}



export async function getProductBySlug(slug: string) {
    try {
        const response = await fetch(API_URL + `/products?filters[slug][$eq]=${slug}&populate=*`);
        if (!response.ok) {
            throw new Error(`Failed to fetch product: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched product:", data);
        return data.data[0]; // Return the first result, assuming slugs are unique
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

// Parts and Accessories API Functions
export async function getPartCategories() {
    try {
        const response = await fetch(API_URL + `/part-categories?populate=image`);
        if (!response.ok) {
            throw new Error(`Failed to fetch part categories ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched part categories:", data);
        return data.data || [];
    } catch (error) {
        console.error("Error fetching part categories:", error);
        return [];
    }
}


export async function getPartCategoryBySlug(slug: string) {
    try {
        const response = await fetch(API_URL + `/part-categories?filters[slug][$eq]=${slug}&populate=image&populate=parts.image`);
        if (!response.ok) {
            throw new Error(`Failed to fetch part categories: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched part category:", data);
        return data.data[0]; // Return the first result, assuming slugs are unique
    } catch (error) {
        console.error("Error fetching part categories:", error);
        return null;
    }
}

export async function getPartBySlug(slug: string) {
    try {
        const response = await fetch(API_URL + `/parts?filters[slug][$eq]=${slug}&populate=*`);
        if (!response.ok) {
            throw new Error(`Failed to fetch part: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched part:", data);
        return data.data[0]; // Return the first result, assuming slugs are unique
    } catch (error) {
        console.error("Error fetching part:", error);
        return null;
    }
}







// Helper Function to process Strapi rich text into a simple string
export const processRichText = (richText: any, depth = 0): string => {
    if (Array.isArray(richText)) {
        return richText.map((item: any) => {
            switch (item.type) {
                case "heading":
                    const level = item.level || 1;
                    const headingText = processRichText(item.children, depth);
                    return `<h${level} class="text-${level === 1 ? '3xl' : level === 2 ? '2xl' : 'xl'} font-bold mb-4">${headingText}</h${level}>`;

                case "paragraph":
                    return `<p class="mb-4">${processRichText(item.children, depth)}</p>`;

                case "text":
                    let text = item.text || '';
                    if (item.bold) text = `<strong>${text}</strong>`;
                    if (item.italic) text = `<em>${text}</em>`;
                    if (item.underline) text = `<u>${text}</u>`;
                    if (item.strikethrough) text = `<del>${text}</del>`;
                    if (item.code) text = `<code class="bg-gray-100 p-1 rounded">${text}</code>`;
                    return text;

                case "link":
                    const linkText = processRichText(item.children, depth);
                    return `<a href="${item.url}" class="text-blue-600 underline" target="_blank">${linkText}</a>`;

                case "image":
                    const img = item.image;
                    if (img) {
                        return `<img 
                            src="${img.url}" 
                            alt="${img.alternativeText || 'Image'}" 
                            width="${img.width || 'auto'}" 
                            height="${img.height || 'auto'}" 
                            class="my-4 rounded-lg shadow-lg"
                        />`;
                    }
                    return '';

                case "list":
                    const isOrdered = item.format === "ordered";
                    const listTag = isOrdered ? "ol" : "ul";

                    // Handle list styles based on depth
                    const unorderedStyles = ['disc', 'circle', 'square'];
                    const orderedStyles = ['decimal', 'lower-alpha', 'lower-roman'];
                    const listStyle = isOrdered
                        ? orderedStyles[depth % orderedStyles.length]
                        : unorderedStyles[depth % unorderedStyles.length];

                    return `<${listTag} class="ml-4" style="list-style-type: ${listStyle};">
                        ${processRichText(item.children, depth + 1)}
                    </${listTag}>`;

                case "list-item":
                    return `<li class="mb-2">${processRichText(item.children, depth)}</li>`;

                default:
                    return '';
            }
        }).join('');
    }

    return richText?.text || '';
};













