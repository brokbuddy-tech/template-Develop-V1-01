import { getAgencyDisplayName, getSiteConfig } from '@/lib/public-site';
import { getRequestAgencySlug } from '@/lib/server-agency';

export default async function InvestPage() {
  const agencySlug = await getRequestAgencySlug();
  const siteConfig = await getSiteConfig(agencySlug);
  const agencyName = getAgencyDisplayName(siteConfig);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12 text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Invest in Dubai Real Estate</h1>
      <p className="text-muted-foreground mb-8">Explore investment opportunities with {agencyName}.</p>
    </div>
  );
}
