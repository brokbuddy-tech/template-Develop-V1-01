"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAgents, getSiteConfig, hasMeaningfulSiteConfig, type SiteAgent, type SiteConfig } from "@/lib/public-site";
import { prefixAgencyPath, resolveAgencySlugFromPathname } from "@/lib/agency-routing";

function getDisplayName(siteConfig: SiteConfig | null) {
  return siteConfig?.branding?.displayName || siteConfig?.organization.name || "Agency Website";
}

function getAgentImage(seed: string, avatar?: string | null) {
  if (avatar) return avatar;
  const initials = seed
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "AG";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f4f6f8"/><stop offset="1" stop-color="#d5dde6"/></linearGradient></defs><rect width="800" height="1000" fill="url(#g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#526273" font-family="Arial, sans-serif" font-size="240" font-weight="700">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function DevelopAgentsPageContent({
  initialSiteConfig = null,
  initialAgents = [],
}: {
  initialSiteConfig?: SiteConfig | null;
  initialAgents?: SiteAgent[];
}) {
  const pathname = usePathname();
  const agencySlug = resolveAgencySlugFromPathname(pathname);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(initialSiteConfig);
  const [agents, setAgents] = useState<SiteAgent[]>(initialAgents);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSiteConfig((current) => initialSiteConfig ?? current ?? null);
    setAgents((current) => (initialAgents.length > 0 ? initialAgents : current));
  }, [initialSiteConfig, initialAgents]);

  useEffect(() => {
    let active = true;

    async function load() {
      const [nextSiteConfig, nextAgents] = await Promise.all([
        getSiteConfig(agencySlug),
        getAgents(agencySlug),
      ]);

      if (!active) return;
      if (hasMeaningfulSiteConfig(nextSiteConfig)) {
        setSiteConfig(nextSiteConfig);
      }
      setAgents((current) => (
        nextAgents.agents.length > 0 || current.length === 0
          ? nextAgents.agents
          : current
      ));
    }

    void load();
    return () => {
      active = false;
    };
  }, [agencySlug]);

  const displayName = getDisplayName(siteConfig);
  const filteredAgents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return agents;

    return agents.filter((agent) => {
      const haystack = [
        agent.name,
        agent.jobTitle,
        agent.title,
        agent.tagline,
        agent.bio,
        ...(agent.languages || []),
        ...(agent.specializations || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [agents, search]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Meet the Agents at {displayName}</h1>
      <p className="text-muted-foreground mb-8">
        Connect with the live public agent roster for this organization.
      </p>

      <div className="flex gap-2 mb-8">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by neighborhood, language, or specialization..."
        />
        <Button className="bg-primary text-primary-foreground">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAgents.map((agent) => (
          <Link key={agent.slug || agent.id || agent.name} href={prefixAgencyPath(`/agents/${agent.slug || ""}`, agencySlug)} className="rounded-[10px] border bg-card overflow-hidden">
            <div className="relative h-64 w-full">
              <Image src={getAgentImage(agent.slug || agent.name, agent.avatar)} alt={agent.name} fill className="object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold">{agent.name}</h3>
              <p className="text-primary text-sm mt-1">{agent.jobTitle || agent.title || agent.tagline || "Property Consultant"}</p>
              <p className="text-sm text-muted-foreground mt-4">{agent.bio || `${agent.name} is part of the active public roster for ${displayName}.`}</p>
            </div>
          </Link>
        ))}
      </div>

      {filteredAgents.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">No public agents matched the current search.</p>
      ) : null}
    </div>
  );
}
