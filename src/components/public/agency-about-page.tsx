"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
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

export function DevelopAboutPageContent({
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
  const aboutCompany =
    siteConfig?.profile?.aboutCompany?.trim() ||
    siteConfig?.branding?.bio?.trim() ||
    `${displayName} keeps its public identity, agents, and listings in sync with Broker OS through slug-aware routing and hex-code secured public APIs.`;

  return (
    <div className="relative">
      <div className="absolute inset-0 h-[50vh]">
        <Image
          src="https://picsum.photos/seed/develop-about-dynamic/1600/1000"
          alt={displayName}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12 md:pt-48 md:pb-24">
        <div className="text-center mb-12 text-white">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">About {displayName}</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
            {aboutCompany}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
            { title: "Organization Profile", body: aboutCompany },
            {
              title: "Public Data Flow",
              body: "Public pages stay on root-based routes, while organization, agent, listing, logo, and profile media requests are resolved server-side through the public template proxy contract.",
            },
          ].map((card) => (
            <div key={card.title} className="bg-card/80 backdrop-blur-sm border border-border rounded-[10px] p-6">
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p className="text-muted-foreground mt-4">{card.body}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <h2 className="text-3xl font-bold">Meet Our Public Agents</h2>
            <Link href={prefixAgencyPath("/agents", agencySlug)}>
              <Button className="bg-primary text-primary-foreground">View All Agents</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.slice(0, 6).map((agent) => (
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
        </div>
      </div>
    </div>
  );
}
