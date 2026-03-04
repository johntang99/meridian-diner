import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { getBaseUrlFromHost } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const host = headers().get('host');
  const baseUrl = getBaseUrlFromHost(host);

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/_next/static/', '/_next/image/'],
        disallow: ['/admin', '/admin/', '/api/admin/', '/api/'],
      },
    ],
    sitemap: new URL('/sitemap.xml', baseUrl).toString(),
  };
}
