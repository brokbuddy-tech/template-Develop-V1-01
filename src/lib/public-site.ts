import type { Property } from './types';
import { getDefaultAgencySlug, getEffectiveAgencySlug } from './agency-routing';
import { PUBLIC_API_BASE_URLS, getClientTemplateFetchUrl, shouldRetryApiRequest } from './api-base';
import { mapListingToProperty } from './api';

export type SiteAgent = {
  id?: string;
  name: string;
  title?: string | null;
  jobTitle?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  avatar?: string | null;
  coverImage?: string | null;
  slug?: string | null;
  tagline?: string | null;
  bio?: string | null;
  website?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  specializations?: string[];
  languages?: string[];
  yearsExperience?: number | null;
  totalDeals?: number;
  totalListings?: number;
  primaryColor?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

export type SiteProfile = {
  logo?: string | null;
  aboutCompany?: string;
  officeAddress?: string;
  officeTimings?: string;
  primaryColor?: string;
  secondaryColor?: string;
  contact?: {
    primaryPhone?: string;
    secondaryPhone?: string;
    whatsappNumber?: string;
    officialEmail?: string;
  };
  social?: {
    facebookUrl?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
    twitterUrl?: string;
    youtubeUrl?: string;
  };
  footer?: {
    copyrightSuffix?: string;
    privacyPolicyText?: string;
    termsAndConditionsText?: string;
  };
};

export type SiteConfig = {
  organization: {
    id?: string;
    name: string;
    slug: string;
    hexCode?: string;
    templateUrl?: string | null;
    publicAgencyUrl?: string | null;
    country?: string | null;
  };
  profile?: SiteProfile | null;
  branding?: {
    displayName?: string | null;
    tagline?: string | null;
    bio?: string | null;
    publicEmail?: string | null;
    publicPhone?: string | null;
    whatsapp?: string | null;
    website?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
    primaryColor?: string | null;
    coverImage?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
  } | null;
  leadAgent?: SiteAgent | null;
  stats?: {
    totalListings: number;
    readyListings: number;
    offPlanListings: number;
    activeAgents: number;
    awards: number;
    blogs: number;
    testimonials: number;
  };
};

type ResolvedAgencyContext = {
  organization?: {
    slug?: string;
    hexCode?: string;
  };
};

function appendHexToSearch(search: string, hexCode: string) {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  params.set('hex', hexCode);
  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

function buildBackendPublicUrl(publicApiBaseUrl: string, agencySlug: string, hexCode: string, path = '') {
  const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const [pathname, search = ''] = normalizedPath.split('?');
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return `${publicApiBaseUrl}/organization${appendHexToSearch(search ? `?${search}` : '', hexCode)}`;
  }

  if (segments[0] === 'agents') {
    if (segments[1]) {
      return `${publicApiBaseUrl}/agent/${encodeURIComponent(segments[1])}${appendHexToSearch(search ? `?${search}` : '', hexCode)}`;
    }
    return `${publicApiBaseUrl}/agents${appendHexToSearch(search ? `?${search}` : '', hexCode)}`;
  }

  if (segments[0] === 'listings') {
    if (segments[1]) {
      return `${publicApiBaseUrl}/listings/${encodeURIComponent(segments[1])}${appendHexToSearch(search ? `?${search}` : '', hexCode)}`;
    }
    return `${publicApiBaseUrl}/listings${appendHexToSearch(search ? `?${search}` : '', hexCode)}`;
  }

  return `${publicApiBaseUrl}/organization${appendHexToSearch(search ? `?${search}` : '', hexCode)}`;
}

async function safeFetch(url: string, options?: RequestInit, timeout = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch {
    return new Response(null, { status: 503, statusText: 'Service Unavailable' });
  } finally {
    clearTimeout(timer);
  }
}

async function resolveAgencyContext(agencySlug?: string | null) {
  const resolvedAgencySlug = getEffectiveAgencySlug(agencySlug);
  if (!resolvedAgencySlug) return null;

  for (const publicApiBaseUrl of PUBLIC_API_BASE_URLS) {
    try {
      const response = await safeFetch(`${publicApiBaseUrl}/agency/${encodeURIComponent(resolvedAgencySlug)}/resolve`, {
        cache: 'no-store',
      }, 4000);
      if (!response.ok) continue;
      const data = await response.json() as ResolvedAgencyContext;
      if (data?.organization?.hexCode) {
        return data;
      }
    } catch {
      continue;
    }
  }

  return null;
}

async function fetchTemplateResponse(path = '', options?: RequestInit, agencySlug?: string | null) {
  const resolvedAgencySlug = getEffectiveAgencySlug(agencySlug) || getDefaultAgencySlug();
  if (!resolvedAgencySlug) {
    return new Response(null, { status: 404, statusText: 'Agency Not Found' });
  }

  if (typeof window !== 'undefined') {
    return safeFetch(getClientTemplateFetchUrl(path, resolvedAgencySlug), options);
  }

  const resolvedContext = await resolveAgencyContext(resolvedAgencySlug);
  const hexCode = resolvedContext?.organization?.hexCode;
  if (!hexCode) {
    return new Response(null, { status: 404, statusText: 'Agency Not Found' });
  }

  let lastResponse: Response | null = null;
  for (const publicApiBaseUrl of PUBLIC_API_BASE_URLS) {
    const backendUrl = buildBackendPublicUrl(publicApiBaseUrl, resolvedAgencySlug, hexCode, path);
    const response = await safeFetch(backendUrl, options);
    lastResponse = response;
    if (response.ok || !(await shouldRetryApiRequest(response))) {
      return response;
    }
  }

  return lastResponse || new Response(null, { status: 502, statusText: 'Service Unavailable' });
}

export async function getSiteConfig(agencySlug?: string | null): Promise<SiteConfig> {
  const response = await fetchTemplateResponse('', { next: { revalidate: 300 } } as RequestInit, agencySlug);
  const fallbackSlug = getEffectiveAgencySlug(agencySlug) || getDefaultAgencySlug() || 'organization';

  if (!response.ok) {
    return { organization: { name: 'Agency Website', slug: fallbackSlug } };
  }

  const data = await response.json();
  return {
    organization: data.organization || { name: 'Agency Website', slug: fallbackSlug },
    profile: data.profile || null,
    branding: data.branding || null,
    leadAgent: data.leadAgent || null,
    stats: data.stats || undefined,
  };
}

export async function getAgents(agencySlug?: string | null) {
  const response = await fetchTemplateResponse('/agents', { next: { revalidate: 300 } } as RequestInit, agencySlug);
  const fallback = await getSiteConfig(agencySlug);

  if (!response.ok) {
    return { organization: fallback.organization, agents: [] as SiteAgent[] };
  }

  const data = await response.json();
  return {
    organization: data.organization || fallback.organization,
    agents: Array.isArray(data.agents) ? data.agents as SiteAgent[] : [],
  };
}

export async function getAgentProfile(agentSlug: string, agencySlug?: string | null) {
  const response = await fetchTemplateResponse(`/agents/${agentSlug}`, { next: { revalidate: 300 } } as RequestInit, agencySlug);
  if (!response.ok) return null;

  const data = await response.json();
  return {
    organization: data.organization,
    profile: data.profile || null,
    agent: data.agent as SiteAgent | null,
    stats: data.stats || { activeListings: 0, soldListings: 0, rentedListings: 0 },
    activeListings: Array.isArray(data.activeListings)
      ? data.activeListings.map((listing: any) => mapListingToProperty(listing, agencySlug))
      : [] as Property[],
    soldListings: Array.isArray(data.soldListings)
      ? data.soldListings.map((listing: any) => mapListingToProperty(listing, agencySlug))
      : [] as Property[],
    rentedListings: Array.isArray(data.rentedListings)
      ? data.rentedListings.map((listing: any) => mapListingToProperty(listing, agencySlug))
      : [] as Property[],
  };
}
