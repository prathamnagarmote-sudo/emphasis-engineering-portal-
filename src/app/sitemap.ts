import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://emphasisengineering.com';

  // Base routes
  const routes: MetadataRoute.Sitemap = [
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
    changeFrequency: 'weekly',
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
          changeFrequency: 'monthly',
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
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      });
    }
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return routes;
}
