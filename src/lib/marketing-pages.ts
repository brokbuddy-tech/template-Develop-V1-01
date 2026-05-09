export type DevelopServicePage = {
  slug: string;
  title: string;
  summary: string;
  highlights: string[];
};

export const DEVELOP_SERVICE_PAGES: DevelopServicePage[] = [
  {
    slug: 'property-management',
    title: 'Property Management',
    summary:
      'Operations support for landlords who need leasing coordination, tenant communication, and a clearer view of portfolio performance.',
    highlights: [
      'Day-to-day owner support shaped around occupancy, renewals, and maintenance visibility.',
      'A public-facing route that can sit behind dynamic branding and contact details.',
      'A practical destination for service-led leads coming from navigation and footer links.',
    ],
  },
  {
    slug: 'interior-design',
    title: 'Interior Design',
    summary:
      'Presentation-focused advisory for owners and investors preparing stock for launch, short-stay demand, or stronger resale positioning.',
    highlights: [
      'Support around styling, presentation, and perception at first touch.',
      'Useful for both premium listings and furnished investment stock.',
      'A stronger landing page target than a dead-end placeholder route.',
    ],
  },
  {
    slug: 'mortgage',
    title: 'Mortgage Consultancy',
    summary:
      'Affordability and financing guidance designed to help buyers move from browsing to a realistic acquisition plan.',
    highlights: [
      'Early-stage financing guidance before buyers commit to a shortlist.',
      'A clear CTA path into contact and advisory workflows.',
      'Fits naturally with investment, ready-property, and first-time buyer journeys.',
    ],
  },
  {
    slug: 'relocation',
    title: 'Relocation Services',
    summary:
      'A soft-landing service route for clients moving cities or countries and needing a guided entry into the UAE housing market.',
    highlights: [
      'Useful for buyers and tenants who need more context than a listing grid provides.',
      'Creates a route target for footer links that previously had no matching page.',
      'Keeps the service architecture aligned with the rest of the template navigation.',
    ],
  },
];

export function getDevelopServicePage(serviceSlug: string) {
  return DEVELOP_SERVICE_PAGES.find((service) => service.slug === serviceSlug) ?? null;
}
