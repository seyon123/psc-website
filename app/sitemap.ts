// app/sitemap.ts
import { getProductLines, getPartCategories } from '@/lib/api';
import { ProductLine } from '@/types/products';
import { PartCategory } from '@/types/parts';
import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pscclean.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all product lines and their products
  const productLines = await getProductLines();

  // Get all part categories and their parts
  const partCategories = await getPartCategories();

  // Base static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/parts-and-accessories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  // Product line routes
  const productLineRoutes = productLines?.map((line: ProductLine) => ({
    url: `${baseUrl}/products/${line.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || [];

  // Product routes
  const productRoutes = productLines?.flatMap((line: ProductLine) =>
    line.products?.map((product) => ({
      url: `${baseUrl}/products/${line.slug}/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || []
  ) || [];

  // Part category routes
  const partCategoryRoutes = partCategories?.map((category: PartCategory) => ({
    url: `${baseUrl}/parts-and-accessories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || [];

  // Part routes
  const partRoutes = partCategories?.flatMap((category: PartCategory) =>
    category.parts?.map((part) => ({
      url: `${baseUrl}/parts-and-accessories/${category.slug}/${part.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || []
  ) || [];

  // Combine all routes
  return [...staticRoutes, ...productLineRoutes, ...productRoutes, ...partCategoryRoutes, ...partRoutes];
}