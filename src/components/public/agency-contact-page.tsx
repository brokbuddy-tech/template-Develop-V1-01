"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getSiteConfig, hasMeaningfulSiteConfig, submitOrgInquiry, type SiteConfig } from "@/lib/public-site";
import { getEffectiveAgencySlug, resolveAgencySlugFromPathname } from "@/lib/agency-routing";
import { usePathname } from "next/navigation";

function getDisplayName(siteConfig: SiteConfig | null) {
  return siteConfig?.branding?.displayName || siteConfig?.organization.name || "Agency Website";
}

export function DevelopContactPageContent({
  initialSiteConfig = null,
}: {
  initialSiteConfig?: SiteConfig | null;
}) {
  const pathname = usePathname();
  const agencySlug = getEffectiveAgencySlug(
    resolveAgencySlugFromPathname(pathname) || initialSiteConfig?.organization.slug,
  );
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(initialSiteConfig);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setSiteConfig((current) => initialSiteConfig ?? current ?? null);
  }, [initialSiteConfig]);

  useEffect(() => {
    let active = true;

    async function load() {
      const nextSiteConfig = await getSiteConfig(agencySlug);
      if (active && hasMeaningfulSiteConfig(nextSiteConfig)) {
        setSiteConfig(nextSiteConfig);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [agencySlug]);

  const displayName = getDisplayName(siteConfig);
  const officeAddress = siteConfig?.profile?.officeAddress?.trim() || "Address shared on request";
  const officeEmail =
    siteConfig?.profile?.contact?.officialEmail ||
    siteConfig?.branding?.publicEmail ||
    siteConfig?.leadAgent?.email ||
    "hello@example.com";
  const officePhone =
    siteConfig?.profile?.contact?.primaryPhone ||
    siteConfig?.branding?.publicPhone ||
    siteConfig?.leadAgent?.phone ||
    "Phone available on request";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    try {
      await submitOrgInquiry({
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        message: subject ? `Subject: ${subject}\n\n${message}` : message,
        templateName: "Develop V1",
        formContext: "contact-page",
      }, agencySlug);

      form.reset();
      toast({
        title: "Message sent",
        description: `Thank you. ${displayName} will contact you shortly.`,
      });
    } catch (error) {
      toast({
        title: "Unable to send message",
        description: error instanceof Error ? error.message : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative isolate">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://picsum.photos/seed/develop-contact-dynamic/1600/1000"
          alt={displayName}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Contact {displayName}</h1>
          <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
            Public contact details for the organization are managed in Broker OS and reflected here automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-background/80 backdrop-blur-sm border-gray-600 rounded-[10px] p-6">
            <h2 className="text-xl font-semibold">Send us a Message</h2>
            <form
              className="space-y-6 mt-6"
              method="post"
              action="#"
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="space-y-2">
                <label className="text-sm">Full Name</label>
                <Input name="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Email Address</label>
                <Input name="email" type="email" placeholder="john.doe@example.com" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Phone</label>
                <Input name="phone" type="tel" placeholder="+971 50 123 4567" />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Subject</label>
                <Input name="subject" placeholder="How can we help?" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Message</label>
                <Textarea name="message" placeholder={`Tell ${displayName} how the team can help.`} rows={5} required minLength={10} />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground disabled:opacity-70">
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-background/80 backdrop-blur-sm border-gray-600 rounded-[10px] p-6 space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Our Office</h3>
                  <p className="text-muted-foreground">{officeAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Phone</h3>
                  <p className="text-muted-foreground">{officePhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="text-muted-foreground">{officeEmail}</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden bg-background/80 backdrop-blur-sm border-gray-600 rounded-[10px] p-6">
              <p className="text-sm text-muted-foreground">
                The public URL is brand-friendly, but all public APIs behind this page still resolve
                the organization through the secure hex code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
