"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAgentProfile } from "@/lib/public-site";
import { prefixAgencyPath, resolveAgencySlugFromPathname } from "@/lib/agency-routing";

function getAgentImage(seed: string, avatar?: string | null) {
  return avatar || `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/1000`;
}

function getWhatsAppHref(value?: string | null, message?: string) {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  if (!digits) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

function getPropertyImage(listing: any) {
  const candidate = listing.primaryImage?.src || listing.imageId;
  if (typeof candidate === "string" && (/^https?:\/\//i.test(candidate) || candidate.startsWith("/"))) {
    return candidate;
  }
  return "https://picsum.photos/seed/develop-property/1200/800";
}

export function DevelopAgentProfilePageContent({ agentSlug }: { agentSlug: string }) {
  const pathname = usePathname();
  const agencySlug = resolveAgencySlugFromPathname(pathname);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getAgentProfile>> | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const nextProfile = await getAgentProfile(agentSlug, agencySlug);
      if (!active) return;
      setProfile(nextProfile);
      setLoading(false);
    }

    void load();
    return () => {
      active = false;
    };
  }, [agentSlug, agencySlug]);

  if (loading) {
    return <div className="w-full px-4 sm:px-6 lg:px-8 py-20 text-center text-muted-foreground">Loading profile...</div>;
  }

  if (!profile?.agent) {
    return <div className="w-full px-4 sm:px-6 lg:px-8 py-20 text-center text-muted-foreground">Agent not found.</div>;
  }

  const displayName = profile.organization?.name || "Agency Website";
  const whatsappHref = getWhatsAppHref(
    profile.agent.whatsapp || profile.agent.phone || profile.profile?.contact?.whatsappNumber,
    `Hi ${profile.agent.name}, I would like to discuss your listings with ${displayName}.`
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-12">
        <div className="rounded-[10px] border bg-card overflow-hidden">
          <div className="relative h-80 w-full">
            <Image src={getAgentImage(profile.agent.slug || profile.agent.name, profile.agent.avatar)} alt={profile.agent.name} fill className="object-cover" />
          </div>
          <div className="p-6 space-y-4">
            <h1 className="text-3xl font-bold">{profile.agent.name}</h1>
            <p className="text-primary">{profile.agent.jobTitle || profile.agent.title || profile.agent.tagline || "Property Consultant"}</p>
            <div className="grid gap-3">
              {profile.agent.phone ? (
                <a href={`tel:${profile.agent.phone}`}>
                  <Button className="w-full bg-primary text-primary-foreground">
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
                </a>
              ) : null}
              {profile.agent.email ? (
                <a href={`mailto:${profile.agent.email}`}>
                  <Button variant="outline" className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                </a>
              ) : null}
              {whatsappHref ? (
                <a href={whatsappHref} target="_blank" rel="noreferrer">
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-[10px] border bg-card p-6">
            <p className="text-sm text-muted-foreground">{displayName}</p>
            <h2 className="text-2xl font-bold mt-2">Public Agent Branding</h2>
            <p className="mt-4 text-muted-foreground">
              {profile.agent.bio || `${profile.agent.name} is part of the public-facing team for ${displayName}.`}
            </p>
          </div>

          <div className="rounded-[10px] border bg-card p-6">
            <h3 className="text-xl font-semibold">Active Listings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {profile.activeListings.map((listing: any) => (
                <Link key={listing.id} href={prefixAgencyPath(`/property/${listing.id}`, agencySlug)} className="rounded-[10px] border overflow-hidden">
                  <div className="relative h-56 w-full">
                    <Image src={getPropertyImage(listing)} alt={listing.name || listing.title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold">{listing.name || listing.title}</h4>
                    <p className="text-sm text-muted-foreground mt-2">{listing.location}</p>
                    <p className="text-primary font-semibold mt-3">{listing.price}</p>
                  </div>
                </Link>
              ))}
            </div>
            {profile.activeListings.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No public listings are active for this agent yet.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
