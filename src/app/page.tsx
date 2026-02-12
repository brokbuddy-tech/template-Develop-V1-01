import { AreaGuides } from '@/components/home/area-guides';
import { DevelopEcosystem } from '@/components/home/ecosystem';
import { FeaturedProperties } from '@/components/home/featured-properties';
import { HeroSection } from '@/components/home/hero-section';
import { Testimonials } from '@/components/home/testimonials';
import { TrustSignals } from '@/components/home/trust-signals';
import { featuredOffPlan, featuredReady, areaGuides, testimonials } from '@/lib/data';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <TrustSignals />
      <FeaturedProperties title="Premium Off-Plan Launches" properties={featuredOffPlan} />
      <AreaGuides title="Explore Dubai's Prime Areas" guides={areaGuides} />
      <FeaturedProperties title="Ready-to-Move Residences" properties={featuredReady} />
      <DevelopEcosystem />
      <Testimonials testimonials={testimonials} />
    </div>
  );
}
