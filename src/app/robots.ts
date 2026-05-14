import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://emphasisengineering.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/dashboard',
        '/api',
        '/dev-panel',
        '/cart',
        '/checkout',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
