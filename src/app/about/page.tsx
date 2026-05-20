import { DevelopAboutPageContent } from '@/components/public/agency-about-page';
import { getTestimonials } from '@/lib/api';
import { getAgents, getSiteConfig } from '@/lib/public-site';
import { getRequestAgencySlug } from '@/lib/server-agency';

export default async function AboutPage() {
  const agencySlug = await getRequestAgencySlug();
  const [siteConfig, agentsResponse, testimonials] = await Promise.all([
    getSiteConfig(agencySlug),
    getAgents(agencySlug),
    getTestimonials(agencySlug),
  ]);

  return (
    <DevelopAboutPageContent
      initialSiteConfig={siteConfig}
      initialAgents={agentsResponse.agents}
      initialTestimonials={testimonials}
    />
  );
}
