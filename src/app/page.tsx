import { AreaGuides } from '@/components/home/area-guides';
import { DevelopEcosystem } from '@/components/home/ecosystem';
import { FeaturedProperties } from '@/components/home/featured-properties';
import { HeroSection } from '@/components/home/hero-section';
import { Testimonials } from '@/components/home/testimonials';
import { TrustSignals } from '@/components/home/trust-signals';
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

  const propertiesToUse = allProperties.length > 0 ? allProperties : [];
  const featuredOffPlan = propertiesToUse.filter(p => p.status === 'Off-plan').slice(0, 3);
  const featuredReady = propertiesToUse.filter(p => p.status === 'Ready').slice(0, 3);
  const guidesToUse = dynamicAreaGuides.length > 0 ? dynamicAreaGuides : [];
  const testimonialsToUse = dynamicTestimonials.length > 0 ? dynamicTestimonials : [];
  const blogsToUse = dynamicBlogs.length > 0 ? dynamicBlogs : [];

  return (
    <div className="flex flex-col">
      <HeroSection />
      <TrustSignals />
      <CityIndex />
      <FeaturedProperties title="Premium Off-Plan Launches" properties={featuredOffPlan} />
      <AreaGuides title="Explore Dubai's Prime Areas" guides={guidesToUse} />
      <FeaturedProperties title="Ready-to-Move Residences" properties={featuredReady} />
      <AreaGuidesDiscovery />
      <DevelopEcosystem />
      <Testimonials testimonials={testimonialsToUse} />
      <FAQ />
      <BlogSection blogs={blogsToUse} />
    </div>
  );
}
