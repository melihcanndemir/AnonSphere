import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AnonSphere',
    short_name: 'AnonSphere',
    description: 'WhisprBox — Anonymous Confession Wall (With AI Sentiment Filter)',
    start_url: '/',
    display: 'standalone',
    background_color: '#f0f0f0', 
    theme_color: '#008080', 
    icons: [
      {
        src: '/icons/icon-192x192.png', 
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icons/icon-512x512.png', 
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  };
}

// git
