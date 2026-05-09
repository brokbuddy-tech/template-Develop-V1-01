export const AGENCY_SLUG_COOKIE = 'bb_agency_slug';

const RESERVED_ROOT_SEGMENTS = new Set([
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
]);

export function normalizeAgencySlug(value?: string | null) {
  const trimmed = value?.trim().replace(/^\/+|\/+$/g, '');
  return trimmed || null;
}

export function getDefaultAgencySlug() {
  return normalizeAgencySlug(process.env.NEXT_PUBLIC_ORG_SLUG || '');
}

export function isAgencySlugSegment(value?: string | null) {
  const normalized = normalizeAgencySlug(value);
  if (!normalized) return false;
  if (RESERVED_ROOT_SEGMENTS.has(normalized)) return false;
  if (normalized.includes('.')) return false;
  return true;
}

export function resolveAgencySlugFromPathname(pathname?: string | null) {
  if (!pathname) return null;
  const [firstSegment] = pathname.split('?')[0].split('/').filter(Boolean);
  return isAgencySlugSegment(firstSegment) ? firstSegment : null;
}

export function getAgencySlugFromBrowserPathname() {
  if (typeof window === 'undefined') return null;
  return resolveAgencySlugFromPathname(window.location.pathname);
}

export function getEffectiveAgencySlug(explicitAgencySlug?: string | null) {
  return (
    normalizeAgencySlug(explicitAgencySlug)
    || getAgencySlugFromBrowserPathname()
    || getDefaultAgencySlug()
  );
}

export function prefixAgencyPath(path: string, agencySlug?: string | null) {
  const resolvedAgencySlug = getEffectiveAgencySlug(agencySlug);
  if (!resolvedAgencySlug) return path;
  if (!path) return `/${resolvedAgencySlug}`;
  if (/^https?:\/\//i.test(path) || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path;
  }

  const [pathname, search = ''] = path.split('?');
  const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;

  if (
    normalizedPathname === `/${resolvedAgencySlug}`
    || normalizedPathname.startsWith(`/${resolvedAgencySlug}/`)
  ) {
    return path;
  }

  const prefixedPathname = normalizedPathname === '/'
    ? `/${resolvedAgencySlug}`
    : `/${resolvedAgencySlug}${normalizedPathname}`;

  return search ? `${prefixedPathname}?${search}` : prefixedPathname;
}
