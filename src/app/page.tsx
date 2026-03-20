import { AreaGuides } from '@/components/home/area-guides';
import { DevelopEcosystem } from '@/components/home/ecosystem';
import { FeaturedProperties } from '@/components/home/featured-properties';
import { HeroSection } from '@/components/home/hero-section';
import { Testimonials } from '@/components/home/testimonials';
import { TrustSignals } from '@/components/home/trust-signals';
import { blogPosts } from '@/lib/data'; // keeping blogPosts if types need it, or just remove if unused
import { getProperties, getAreaGuides, getTestimonials, getBlogs } from '@/lib/api';
import { CityIndex } from '@/components/home/city-index';
import { FAQ } from '@/components/home/faq';
import { BlogSection } from '@/components/home/blog-section';
import { AreaGuidesDiscovery } from '@/components/home/area-guides-discovery';

export default async function Home() {
  const [
    { properties: allProperties },
    dynamicAreaGuides,
    dynamicTestimonials,
    dynamicBlogs
  ] = await Promise.all([
    getProperties(),
    getAreaGuides(),
    getTestimonials(),
    getBlogs()
  ]);

  const featuredOffPlan = allProperties.filter(p => p.status === 'Off-plan').slice(0, 3);
  const featuredReady = allProperties.filter(p => p.status === 'Ready').slice(0, 3);

  return (
    <div className="flex flex-col">
      <HeroSection />
      <TrustSignals />
      <CityIndex />
      <FeaturedProperties title="Premium Off-Plan Launches" properties={featuredOffPlan} />
      <AreaGuides title="Explore Dubai's Prime Areas" guides={dynamicAreaGuides.length > 0 ? dynamicAreaGuides : []} />
      <FeaturedProperties title="Ready-to-Move Residences" properties={featuredReady} />
      <AreaGuidesDiscovery />
      <DevelopEcosystem />
      <Testimonials testimonials={dynamicTestimonials.length > 0 ? dynamicTestimonials : []} />
      <FAQ />
      <BlogSection blogs={dynamicBlogs.length > 0 ? dynamicBlogs : []} />
    </div>
  );
}
