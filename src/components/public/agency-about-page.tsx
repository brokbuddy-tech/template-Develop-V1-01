"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Testimonials } from "@/components/home/testimonials";
import { getTestimonials } from "@/lib/api";
import {
  getAgents,
  getSiteConfig,
  hasMeaningfulSiteConfig,
  type SiteAgent,
  type SiteConfig,
} from "@/lib/public-site";
import {
  prefixAgencyPath,
  resolveAgencySlugFromPathname,
} from "@/lib/agency-routing";
import type { Testimonial } from "@/lib/types";
import { AwardsSection } from "../awards-section";
import { awards, blogPosts } from "@/lib/data";
import { FAQ } from "../home/faq";
import { BlogSection } from "../home/blog-section";

function getDisplayName(siteConfig: SiteConfig | null) {
  return (
    siteConfig?.branding?.displayName ||
    siteConfig?.organization.name ||
    "Agency Website"
  );
}

function getAgentImage(seed: string, avatar?: string | null) {
  if (avatar) return avatar;
  const initials =
    seed
      .split(/[\s-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "AG";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f4f6f8"/><stop offset="1" stop-color="#d5dde6"/></linearGradient></defs><rect width="800" height="1000" fill="url(#g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#526273" font-family="Arial, sans-serif" font-size="240" font-weight="700">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getAgentRole(agent: SiteAgent) {
  return agent.jobTitle || agent.title || agent.tagline || "Property Consultant";
}

function getAgentProfilePath(agent: SiteAgent) {
  return agent.slug || agent.id || agent.name;
}

function isLeadershipAgent(agent: SiteAgent) {
  const role = [
    agent.name,
    agent.jobTitle,
    agent.title,
    agent.tagline,
    agent.bio,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return [
    "owner",
    "manager",
    "founder",
    "director",
    "ceo",
    "chief",
    "head",
    "principal",
    "partner",
  ].some((keyword) => role.includes(keyword));
}

function AgentSection({
  title,
  emptyMessage,
  agents,
  agencySlug,
  displayName,
}: {
  title: string;
  emptyMessage: string;
  agents: SiteAgent[];
  agencySlug: string | null;
  displayName: string;
}) {
  return (
    <section className="space-y-6">
      <h3 className="text-3xl font-bold text-center">{title}</h3>
      {agents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <Link
              key={getAgentProfilePath(agent)}
              href={prefixAgencyPath(
                `/agents/${getAgentProfilePath(agent)}`,
                agencySlug,
              )}
              className="rounded-[10px] border bg-card overflow-hidden"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={getAgentImage(
                    agent.slug || agent.id || agent.name,
                    agent.avatar,
                  )}
                  alt={agent.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="text-lg font-semibold">{agent.name}</h4>
                <p className="text-primary text-sm mt-1">
                  {getAgentRole(agent)}
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  {agent.bio ||
                    `${agent.name} is part of the active public roster for ${displayName}.`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      )}
    </section>
  );
}

function normalizeTestimonials(input: unknown[]): Testimonial[] {
  const normalized: Testimonial[] = [];

  input.forEach((item, index) => {
    const testimonial = item as {
      id?: string;
      author?: string | null;
      name?: string | null;
      clientName?: string | null;
      message?: string | null;
      quote?: string | null;
      content?: string | null;
      image?: string | null;
      imageId?: string | null;
      imageUrl?: string | null;
      rating?: number | null;
      badgeLabel?: string | null;
    };

    const quote =
      testimonial.message?.trim() ||
      testimonial.quote?.trim() ||
      testimonial.content?.trim() ||
      "";
    if (!quote) return;

    const name =
      testimonial.author?.trim() ||
      testimonial.name?.trim() ||
      testimonial.clientName?.trim() ||
      "Anonymous";

    normalized.push({
      id: testimonial.id || `${name}-${index}`,
      name,
      quote,
      imageId:
        testimonial.imageUrl?.trim() ||
        testimonial.image?.trim() ||
        testimonial.imageId?.trim() ||
        null,
      rating: typeof testimonial.rating === "number" ? testimonial.rating : 5,
      badgeLabel: testimonial.badgeLabel?.trim() || undefined,
    });
  });

  return normalized;
}

export function DevelopAboutPageContent({
  initialSiteConfig = null,
  initialAgents = [],
  initialTestimonials = [],
}: {
  initialSiteConfig?: SiteConfig | null;
  initialAgents?: SiteAgent[];
  initialTestimonials?: unknown[];
}) {
  const pathname = usePathname();
  const agencySlug = resolveAgencySlugFromPathname(pathname);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(
    initialSiteConfig,
  );
  const [agents, setAgents] = useState<SiteAgent[]>(initialAgents);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() =>
    normalizeTestimonials(initialTestimonials),
  );

  useEffect(() => {
    setSiteConfig((current) => initialSiteConfig ?? current ?? null);
    setAgents((current) =>
      initialAgents.length > 0 ? initialAgents : current,
    );
    setTestimonials(normalizeTestimonials(initialTestimonials));
  }, [initialAgents, initialSiteConfig, initialTestimonials]);

  useEffect(() => {
    let active = true;

    async function load() {
      const [nextSiteConfig, nextAgents, nextTestimonials] = await Promise.all([
        getSiteConfig(agencySlug),
        getAgents(agencySlug),
        getTestimonials(agencySlug),
      ]);

      if (!active) return;
      if (hasMeaningfulSiteConfig(nextSiteConfig)) {
        setSiteConfig(nextSiteConfig);
      }
      setAgents((current) =>
        nextAgents.agents.length > 0 || current.length === 0
          ? nextAgents.agents
          : current,
      );
      setTestimonials(normalizeTestimonials(nextTestimonials));
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
  const mission =
    siteConfig?.profile?.mission?.trim() ||
    `${displayName} helps clients make confident property decisions with clear guidance, responsive communication, and dependable advice at every stage of the deal.`;
  const vision =
    siteConfig?.profile?.vision?.trim() ||
    `To build a public real estate presence for ${displayName} that feels trustworthy, current, and easy for every client to act on.`;
  const leadershipAgents = useMemo(
    () => agents.filter(isLeadershipAgent).slice(0, 6),
    [agents],
  );
  const expertAgents = useMemo(
    () => agents.filter((agent) => !isLeadershipAgent(agent)).slice(0, 6),
    [agents],
  );

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
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            About {displayName}
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
            {aboutCompany}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
            { title: "Our Mission", body: mission },
            { title: "Our Vision", body: vision },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-card/80 backdrop-blur-sm border border-border rounded-[10px] p-6"
            >
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p className="text-muted-foreground mt-4">{card.body}</p>
            </div>
          ))}
        </div>
        <div>
          <div className="flex justify-end gap-4 mb-8">
            <Link href={prefixAgencyPath("/agents", agencySlug)}>
              <Button className="bg-primary text-primary-foreground">
                View All Agents
              </Button>
            </Link>
          </div>
          <div className="space-y-12">
            <AgentSection
              title="Meet Our Leadership"
              emptyMessage="No owners or managers are published on the public roster yet."
              agents={leadershipAgents}
              agencySlug={agencySlug}
              displayName={displayName}
            />
            <AgentSection
              title="Meet Our Expert Agents"
              emptyMessage="No broker profiles are published on the public roster yet."
              agents={expertAgents}
              agencySlug={agencySlug}
              displayName={displayName}
            />
          </div>
        </div>
        <AwardsSection awards={awards} />
        {testimonials.length > 0 ? (
          <div className="mb-16">
            <Testimonials testimonials={testimonials} />
          </div>
        ) : null}
        <FAQ agencyName={""}/>
        <BlogSection blogs={blogPosts} />
      </div>
    </div>
  );
}
