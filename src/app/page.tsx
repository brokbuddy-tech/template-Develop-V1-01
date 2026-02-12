import { AreaGuides } from '@/components/home/area-guides';
import { DevelopEcosystem } from '@/components/home/ecosystem';
import { FeaturedProperties } from '@/components/home/featured-properties';
import { HeroSection } from '@/components/home/hero-section';
import { Testimonials } from '@/components/home/testimonials';
import { TrustSignals } from '@/components/home/trust-signals';
import { featuredOffPlan, featuredReady, areaGuides, testimonials, blogPosts } from '@/lib/data';
import { CityIndex } from '@/components/home/city-index';
import { FAQ } from '@/components/home/faq';
import { BlogSection } from '@/components/home/blog-section';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <TrustSignals />
      <CityIndex />
      <FeaturedProperties title="Premium Off-Plan Launches" properties={featuredOffPlan} />
      <AreaGuides title="Explore Dubai's Prime Areas" guides={areaGuides} />
      <FeaturedProperties title="Ready-to-Move Residences" properties={featuredReady} />
      <DevelopEcosystem />
      <Testimonials testimonials={testimonials} />
      <FAQ />
      <BlogSection blogs={blogPosts} />
    </div>
  );
}
