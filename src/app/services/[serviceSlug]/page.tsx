import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getAgencyDisplayName, getSiteConfig } from '@/lib/public-site';
import { prefixAgencyPath } from '@/lib/agency-routing';
import { getRequestAgencySlug } from '@/lib/server-agency';
import { getDevelopServicePage } from '@/lib/marketing-pages';

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ serviceSlug: string }>;
}) {
  const { serviceSlug } = await params;
  const service = getDevelopServicePage(serviceSlug);

  if (!service) {
    notFound();
  }

  const agencySlug = await getRequestAgencySlug();
  const siteConfig = await getSiteConfig(agencySlug);
  const agencyName = getAgencyDisplayName(siteConfig);

  return (
    <div className="bg-background">
      <section className="border-b border-border/70 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_34%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--muted)/0.4)_100%)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Services
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {service.title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground">
            {service.summary}
          </p>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-muted-foreground">
            {agencyName} can now use this route as a stable service landing page inside the
            organization-aware template flow.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild className="rounded-full px-6">
              <Link href={prefixAgencyPath('/contact', agencySlug)}>Contact Us</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href={prefixAgencyPath('/services', agencySlug)}>All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {service.highlights.map((highlight) => (
            <article key={highlight} className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
              <p className="text-sm leading-7 text-muted-foreground">{highlight}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
