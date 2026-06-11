import type { Property } from './types';
import type { BrokerReviewSources } from './reviews';
import { getDefaultAgencySlug, getEffectiveAgencySlug } from './agency-routing';
import {
  PUBLIC_API_BASE_URLS,
  PUBLIC_TEMPLATE_PROXY_BASE_PATH,
  getConfiguredTemplateHexCode,
  getClientTemplateFetchUrl,
  normalizePublicTemplateAssetUrl,
  shouldRetryApiRequest,
} from './api-base';
import { getProperties, mapListingToProperty } from './api';

export type SiteAgent = {
  id?: string;
  name: string;
  title?: string | null;
  jobTitle?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  brn?: string | null;
  licenseNumber?: string | null;
  avatar?: string | null;
  avatarUrl?: string | null;
  coverImage?: string | null;
  coverImageUrl?: string | null;
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
  reviewSources?: BrokerReviewSources | null;
};

export type SiteProfile = {
  logo?: string | null;
  aboutCompany?: string;
  mission?: string;
  vision?: string;
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

function getPossessiveName(name: string) {
  const trimmedName = name.trim();
  if (!trimmedName) return 'Agency Website';
  return /s$/i.test(trimmedName) ? `${trimmedName}'` : `${trimmedName}'s`;
}

export function getAgencyDisplayName(siteConfig?: SiteConfig | null) {
  return siteConfig?.branding?.displayName?.trim() || siteConfig?.organization.name?.trim() || 'Agency Website';
}

export function replaceTemplateBranding(text: string, agencyName: string) {
  const normalizedAgencyName = agencyName.trim() || 'Agency Website';

  return text
    .replace(/{{agencyName}}/g, normalizedAgencyName)
    .replace(/DEVELOP's/gi, getPossessiveName(normalizedAgencyName))
    .replace(/\bDEVELOP\b/gi, normalizedAgencyName);
}

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

function normalizePublicImageUrl(value?: string | null) {
  const normalized = value?.trim();
  if (!normalized) return null;

  const normalizedProxyPath = normalizePublicTemplateAssetUrl(normalized) || normalized;
  if (/^https?:\/\//i.test(normalizedProxyPath)) return normalizedProxyPath;
  if (normalizedProxyPath.startsWith(PUBLIC_TEMPLATE_PROXY_BASE_PATH)) return normalizedProxyPath;
  return normalizedProxyPath.startsWith('/') ? normalizedProxyPath : `/${normalizedProxyPath}`;
}

function normalizeOrganization(
  organization: SiteConfig['organization'] | undefined,
  fallbackSlug: string,
): SiteConfig['organization'] {
  return {
    ...organization,
    name: organization?.name || 'Agency Website',
    slug: organization?.slug || fallbackSlug,
  };
}

function normalizeLogoUrl(value?: string | null, agencySlug?: string | null) {
  const normalized = value?.trim();
  if (!normalized) return null;
  if (!/^view(?:\?|$)/i.test(normalized)) return null;
  return getClientTemplateFetchUrl(`/logo/${normalized}`, agencySlug);
}

function normalizeProfileAssetUrl(
  value: string | null | undefined,
  assetId: string | null | undefined,
  kind: 'avatar' | 'cover',
  agencySlug?: string | null,
) {
  const normalized = value?.trim();
  if (!normalized || !assetId) return null;
  if (!/^view(?:\?|$)/i.test(normalized)) return null;
  return getClientTemplateFetchUrl(`/profile-assets/${assetId}/${kind}/${normalized}`, agencySlug);
}

function normalizeSiteProfile(profile?: SiteProfile | null, agencySlug?: string | null): SiteProfile | null {
  if (!profile) return null;
  return {
    ...profile,
    logo:
      normalizePublicImageUrl(profile.logo)
      ?? normalizeLogoUrl(profile.logo, agencySlug)
      ?? profile.logo
      ?? null,
  };
}

function normalizeSiteBranding(
  branding: SiteConfig['branding'],
  organizationName: string,
): SiteConfig['branding'] {
  if (!branding) return null;
  return {
    ...branding,
    displayName: organizationName || branding.displayName || null,
    coverImage: normalizePublicImageUrl(branding.coverImage) ?? branding.coverImage ?? null,
  };
}

export function hasMeaningfulSiteConfig(siteConfig?: SiteConfig | null) {
  if (!siteConfig) return false;

  if (siteConfig.profile?.logo) return true;
  if (siteConfig.profile?.aboutCompany?.trim()) return true;
  if (siteConfig.profile?.mission?.trim()) return true;
  if (siteConfig.profile?.vision?.trim()) return true;
  if (siteConfig.profile?.officeAddress?.trim()) return true;
  if (siteConfig.profile?.contact?.officialEmail) return true;
  if (siteConfig.profile?.contact?.primaryPhone) return true;
  if (siteConfig.branding?.displayName?.trim()) return true;
  if (siteConfig.branding?.bio?.trim()) return true;
  if (siteConfig.branding?.publicEmail) return true;
  if (siteConfig.branding?.publicPhone) return true;
  if (siteConfig.branding?.whatsapp) return true;
  if (siteConfig.leadAgent?.name) return true;

  return Boolean(siteConfig.organization?.name && siteConfig.organization.name !== 'Agency Website');
}

function normalizeSiteAgent<T extends SiteAgent | null | undefined>(agent: T, agencySlug?: string | null): T {
  if (!agent) return agent;
  const avatarAssetId = (agent as any).avatarId as string | undefined;
  const coverAssetId = (agent as any).coverImageId as string | undefined;
  return {
    ...agent,
    avatar:
      normalizePublicImageUrl(agent.avatarUrl ?? agent.avatar)
      ?? normalizeProfileAssetUrl(agent.avatarUrl ?? agent.avatar, avatarAssetId, 'avatar', agencySlug)
      ?? agent.avatarUrl
      ?? agent.avatar
      ?? null,
    avatarUrl:
      normalizePublicImageUrl(agent.avatarUrl ?? agent.avatar)
      ?? normalizeProfileAssetUrl(agent.avatarUrl ?? agent.avatar, avatarAssetId, 'avatar', agencySlug)
      ?? agent.avatarUrl
      ?? agent.avatar
      ?? null,
    coverImage:
      normalizePublicImageUrl(agent.coverImageUrl ?? agent.coverImage)
      ?? normalizeProfileAssetUrl(agent.coverImageUrl ?? agent.coverImage, coverAssetId, 'cover', agencySlug)
      ?? agent.coverImageUrl
      ?? agent.coverImage
      ?? null,
    coverImageUrl:
      normalizePublicImageUrl(agent.coverImageUrl ?? agent.coverImage)
      ?? normalizeProfileAssetUrl(agent.coverImageUrl ?? agent.coverImage, coverAssetId, 'cover', agencySlug)
      ?? agent.coverImageUrl
      ?? agent.coverImage
      ?? null,
  } as T;
}

function normalizeSiteAgents(agents: unknown[], agencySlug?: string | null): SiteAgent[] {
  return agents
    .map((agent) => normalizeSiteAgent(agent as SiteAgent | null, agencySlug))
    .filter((agent): agent is SiteAgent => Boolean(agent));
}

function normalizeComparableIdentifier(value?: string | null) {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return null;

  return normalized.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function doesAgentMatchSlug(agentSlug: string, agent?: SiteAgent | null) {
  const normalizedAgentSlug = normalizeComparableIdentifier(agentSlug);
  if (!normalizedAgentSlug || !agent) return false;

  return [agent.slug, agent.id, agent.name].some(
    (value) => normalizeComparableIdentifier(value) === normalizedAgentSlug,
  );
}

function listingBelongsToAgent(listing: any, agentSlug: string, agent?: SiteAgent | null) {
  const normalizedAgentSlug = normalizeComparableIdentifier(agentSlug);
  const normalizedAgentName = normalizeComparableIdentifier(agent?.name);
  const candidates = [
    listing?.agent?.slug,
    listing?.agent?.name,
    listing?.agentName,
    listing?.agent,
    listing?.broker?.brokerProfile?.slug,
    listing?.broker?.brokerProfile?.displayName,
    [listing?.broker?.firstName, listing?.broker?.lastName].filter(Boolean).join(' '),
  ];

  return candidates.some((value) => {
    const normalizedValue = normalizeComparableIdentifier(typeof value === 'string' ? value : null);
    return Boolean(
      normalizedValue
      && (
        normalizedValue === normalizedAgentSlug
        || (normalizedAgentName && normalizedValue === normalizedAgentName)
      ),
    );
  });
}

async function buildFallbackAgentProfile(agentSlug: string, agencySlug?: string | null) {
  const fallbackSlug = getEffectiveAgencySlug(agencySlug) || getDefaultAgencySlug() || 'organization';
  const roster = await getAgents(agencySlug);
  const matchedAgent = roster.agents.find((agent) => doesAgentMatchSlug(agentSlug, agent));

  if (!matchedAgent) {
    return null;
  }

  const listingsResponse = await getProperties({ limit: '200' }, agencySlug);
  const activeListings = listingsResponse.properties.filter((listing) => listingBelongsToAgent(listing, agentSlug, matchedAgent));

  return {
    organization: normalizeOrganization(roster.organization, fallbackSlug),
    profile: null,
    agent: normalizeSiteAgent(matchedAgent, roster.organization.slug || fallbackSlug),
    stats: {
      activeListings: activeListings.length,
      soldListings: 0,
      rentedListings: 0,
    },
    activeListings,
    soldListings: [] as Property[],
    rentedListings: [] as Property[],
  };
}

function getConfiguredAgencyContext(agencySlug?: string | null): ResolvedAgencyContext | null {
  const resolvedAgencySlug = getEffectiveAgencySlug(agencySlug);
  const defaultAgencySlug = getDefaultAgencySlug();
  const configuredHexCode = getConfiguredTemplateHexCode();

  if (!resolvedAgencySlug || !defaultAgencySlug || !configuredHexCode || resolvedAgencySlug !== defaultAgencySlug) {
    return null;
  }

  return {
    organization: {
      slug: resolvedAgencySlug,
      hexCode: configuredHexCode,
    },
  };
}

async function resolveAgencyContext(agencySlug?: string | null) {
  const resolvedAgencySlug = getEffectiveAgencySlug(agencySlug);
  if (!resolvedAgencySlug) return null;

  const configuredContext = getConfiguredAgencyContext(resolvedAgencySlug);
  if (configuredContext) {
    return configuredContext;
  }

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

async function fetchDirectTemplateResponse(
  resolvedAgencySlug: string,
  path = '',
  options?: RequestInit,
) {
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

async function fetchTemplateResponse(path = '', options?: RequestInit, agencySlug?: string | null) {
  const resolvedAgencySlug = getEffectiveAgencySlug(agencySlug) || getDefaultAgencySlug();
  if (!resolvedAgencySlug) {
    return new Response(null, { status: 404, statusText: 'Agency Not Found' });
  }

  if (typeof window !== 'undefined') {
    return safeFetch(getClientTemplateFetchUrl(path, resolvedAgencySlug), options);
  }

  return fetchDirectTemplateResponse(resolvedAgencySlug, path, options);
}

export async function getSiteConfig(agencySlug?: string | null): Promise<SiteConfig> {
  const response = await fetchTemplateResponse('', { next: { revalidate: 300 } } as RequestInit, agencySlug);
  const fallbackSlug = getEffectiveAgencySlug(agencySlug) || getDefaultAgencySlug() || 'organization';

  if (!response.ok) {
    return { organization: { name: 'Agency Website', slug: fallbackSlug } };
  }

  const data = await response.json();
  const organization = normalizeOrganization(data.organization, fallbackSlug);
  return {
    organization,
    profile: normalizeSiteProfile(data.profile || null, organization.slug),
    branding: normalizeSiteBranding(data.branding || null, organization.name),
    leadAgent: normalizeSiteAgent(data.leadAgent || null, organization.slug),
    stats: data.stats || undefined,
  };
}

export async function submitOrgInquiry(payload: Record<string, unknown>, agencySlug?: string | null) {
  const response = await fetchTemplateResponse('/inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, agencySlug);

  if (!response.ok) {
    let message = 'We could not submit your request right now. Please try again shortly.';
    try {
      const errorPayload = await response.json() as { message?: string };
      if (response.status < 500 && errorPayload.message) {
        message = errorPayload.message;
      }
    } catch {
      // Keep the visitor-facing fallback above.
    }
    throw new Error(message);
  }

  return response.json();
}

export async function getAgents(agencySlug?: string | null) {
  const response = await fetchTemplateResponse('/agents', { next: { revalidate: 300 } } as RequestInit, agencySlug);
  const fallback = await getSiteConfig(agencySlug);

  if (!response.ok) {
    return { organization: fallback.organization, agents: [] as SiteAgent[] };
  }

  const data = await response.json();
  const organization = normalizeOrganization(data.organization || fallback.organization, fallback.organization.slug);
  return {
    organization,
    agents: Array.isArray(data.agents) ? normalizeSiteAgents(data.agents, organization.slug) : [],
  };
}

export async function getAgentProfile(agentSlug: string, agencySlug?: string | null) {
  const response = await fetchTemplateResponse(`/agents/${agentSlug}`, { next: { revalidate: 300 } } as RequestInit, agencySlug);
  if (!response.ok) {
    return buildFallbackAgentProfile(agentSlug, agencySlug);
  }

  const data = await response.json();
  const fallbackSlug = getEffectiveAgencySlug(agencySlug) || getDefaultAgencySlug() || 'organization';
  const organization = normalizeOrganization(data.organization, fallbackSlug);
  const normalizedAgent = normalizeSiteAgent(data.agent as SiteAgent | null, organization.slug);

  if (!normalizedAgent) {
    return buildFallbackAgentProfile(agentSlug, agencySlug);
  }

  return {
    organization,
    profile: normalizeSiteProfile(data.profile || null, organization.slug),
    agent: normalizedAgent,
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
