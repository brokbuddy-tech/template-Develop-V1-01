import type {NextConfig} from 'next';

function normalizeApiBaseUrl(value: string) {
  const normalized = value.trim().replace(/\/+$/, '');
  if (!normalized) return '';
  if (/\/api$/i.test(normalized)) return normalized;
  if (/\/api\/public$/i.test(normalized)) return normalized.replace(/\/public$/i, '');
  return `${normalized}/api`;
}

function escapeForRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const reservedRootSegments = [
  '_next',
  'about',
  'agent',
  'agents',
  'all-listings',
  'apartments',
  'api',
  'area-guides',
  'buy',
  'careers',
  'city-index',
  'commercial',
  'contact',
  'content-hub',
  'favicon.ico',
  'find-an-agent',
  'for-developers',
  'insights',
  'instant-valuation',
  'invest',
  'map',
  'off-plan',
  'portals',
  'projects',
  'properties',
  'property',
  'rent',
  'robots.txt',
  'search',
  'sell',
  'services',
  'sitemap.xml',
  'sold',
  'townhouses',
  'villas',
  'vip-portal',
];

const reservedRootPattern = reservedRootSegments.map(escapeForRegex).join('|');
const agencySlugSegmentPattern = `((?!(?:${reservedRootPattern})$)(?!.*\\.)[^/]+)`;
const agencySlugRewrites = [
  {
    source: `/:agencySlug${agencySlugSegmentPattern}`,
    destination: '/',
  },
  {
    source: `/:agencySlug${agencySlugSegmentPattern}/:path*`,
    destination: '/:path*',
  },
];

const apiBaseUrl = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL || 'https://brokbuddy-api.onrender.com');
const apiOrigin = apiBaseUrl.replace(/\/api$/i, '');
const nextConfig: NextConfig = {
  compress: true,
  serverExternalPackages: ['genkit', 'express', '@genkit-ai/google-genai', 'require-in-the-middle'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.brokbuddy.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'brokbuddy-api.onrender.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: agencySlugRewrites,
      fallback: [
        {
          source: '/api/:path*',
          destination: `${apiOrigin}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;

