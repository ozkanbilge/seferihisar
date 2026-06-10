import { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0e0f12',
    theme_color: '#c0a062',
    icons: [
      {
        src: '/icon',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
