import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://emphasisengineering.com';

  // Base routes
  const routes = [
    '',
    '/about',
    '/services',
    '/courses',
    '/practice-tests',
    '/blog',
    '/testimonials',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Dynamic Services
    const servicesRes = await fetch(`${baseUrl}/api/services`);
    if (servicesRes.ok) {
      const services = await servicesRes.json();
      services.forEach((s: any) => {
        routes.push({
          url: `${baseUrl}/services/${encodeURIComponent(s.title)}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        });
      });
    }

    // Dynamic Courses
    const coursesRes = await fetch(`${baseUrl}/api/courses`);
    if (coursesRes.ok) {
      const courses = await coursesRes.json();
      courses.forEach((c: any) => {
        routes.push({
          url: `${baseUrl}/courses/${encodeURIComponent(c.title)}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        });
      });
    }
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return routes;
}
