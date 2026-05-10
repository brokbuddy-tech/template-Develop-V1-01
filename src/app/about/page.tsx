import { DevelopAboutPageContent } from '@/components/public/agency-about-page';
import { getAgents, getSiteConfig } from '@/lib/public-site';
import { getRequestAgencySlug } from '@/lib/server-agency';

export default async function AboutPage() {
  const agencySlug = await getRequestAgencySlug();
  const [siteConfig, agentsResponse] = await Promise.all([
    getSiteConfig(agencySlug),
    getAgents(agencySlug),
  ]);

  return (
    <DevelopAboutPageContent
      initialSiteConfig={siteConfig}
      initialAgents={agentsResponse.agents}
    />
  );
}
