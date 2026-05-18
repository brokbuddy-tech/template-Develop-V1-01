import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getAgencyDisplayName, getSiteConfig } from '@/lib/public-site';
import { prefixAgencyPath } from '@/lib/agency-routing';
import { getRequestAgencySlug } from '@/lib/server-agency';
import { DEVELOP_SERVICE_PAGES } from '@/lib/marketing-pages';

export default async function ServicesPage() {
  const agencySlug = await getRequestAgencySlug();
  const siteConfig = await getSiteConfig(agencySlug);
  const agencyName = getAgencyDisplayName(siteConfig);

  return (
    <div className="bg-background">
      <section className="border-b border-border/70 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.12),transparent_36%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--muted)/0.35)_100%)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Services
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Service routes for {agencyName}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground">
            These pages now exist as real route targets for the template navigation and footer,
            so the public experience no longer breaks when visitors open service links.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          {DEVELOP_SERVICE_PAGES.map((service) => (
            <article key={service.slug} className="rounded-3xl border border-border/70 bg-card p-7 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground">{service.title}</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{service.summary}</p>
              <div className="mt-6">
                <Button asChild className="rounded-full px-6">
                  <Link href={prefixAgencyPath(`/services/${service.slug}`, agencySlug)}>
                    View Service
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
