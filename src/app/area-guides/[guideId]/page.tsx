import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { areaGuides } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { prefixAgencyPath } from '@/lib/agency-routing';
import { getRequestAgencySlug } from '@/lib/server-agency';

export default async function AreaGuideDetailPage({
  params,
}: {
  params: Promise<{ guideId: string }>;
}) {
  const { guideId } = await params;
  const guide = areaGuides.find((item) => item.id === guideId);

  if (!guide) {
    notFound();
  }

  const agencySlug = await getRequestAgencySlug();
  const guideImage = guide.imageId
    ? PlaceHolderImages.find((item) => item.id === guide.imageId)
    : null;

  return (
    <div className="bg-white">
      <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Area Guide
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-black sm:text-5xl">
              {guide.name}
            </h1>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              Rental yield snapshot: {guide.yield}. This route now exists so the guide cards in the
              template lead somewhere intentional instead of falling into a missing page.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild className="rounded-full px-6">
                <Link href={prefixAgencyPath('/contact', agencySlug)}>Talk To An Advisor</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-6">
                <Link href={prefixAgencyPath('/area-guides', agencySlug)}>All Area Guides</Link>
              </Button>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-black/5 bg-muted">
            {guideImage ? (
              <Image
                src={guideImage.imageUrl}
                alt={guide.name}
                fill
                className="object-cover"
                data-ai-hint={guideImage.imageHint}
              />
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
