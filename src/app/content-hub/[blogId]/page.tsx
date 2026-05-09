import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { prefixAgencyPath } from '@/lib/agency-routing';
import { getRequestAgencySlug } from '@/lib/server-agency';

export default async function ContentHubDetailPage({
  params,
}: {
  params: Promise<{ blogId: string }>;
}) {
  const { blogId } = await params;
  const blog = blogPosts.find((item) => item.id === blogId);

  if (!blog) {
    notFound();
  }

  const agencySlug = await getRequestAgencySlug();
  const blogImage = blog.imageId
    ? PlaceHolderImages.find((item) => item.id === blog.imageId)
    : null;

  return (
    <div className="bg-background">
      <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Content Hub
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {blog.title}
          </h1>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {blog.readTime}
          </p>
          {blogImage ? (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl border border-border/70">
              <Image
                src={blogImage.imageUrl}
                alt={blog.title}
                fill
                className="object-cover"
                data-ai-hint={blogImage.imageHint}
              />
            </div>
          ) : null}
          <p className="mt-8 text-base leading-8 text-muted-foreground">
            {blog.excerpt}
          </p>
          <p className="mt-6 text-base leading-8 text-muted-foreground">
            This article route now exists as a proper destination for the home page cards,
            which keeps the public template navigation and content journey coherent.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild className="rounded-full px-6">
              <Link href={prefixAgencyPath('/content-hub', agencySlug)}>Back To Content Hub</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href={prefixAgencyPath('/contact', agencySlug)}>Speak With The Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
