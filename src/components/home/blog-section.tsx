
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Blog } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function BlogCard({ blog }: { blog: Blog }) {
  const blogImage = PlaceHolderImages.find(p => p.id === blog.imageId);
  const authorImage = PlaceHolderImages.find(p => p.id === blog.author.avatarId);

  return (
    <div className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-card flex flex-col text-left">
      {blogImage && (
        <Link href={`/blog/${blog.id}`} className="relative h-48 w-full block">
          <Image
            src={blogImage.imageUrl}
            alt={blog.title}
            fill
            className="object-cover"
            data-ai-hint={blogImage.imageHint}
          />
        </Link>
      )}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-primary text-xs font-semibold mb-2">{blog.readTime}</p>
        <h3 className="font-bold text-sm mb-2 line-clamp-3">
          <Link href={`/blog/${blog.id}`} className="hover:underline">{blog.title}</Link>
        </h3>
        <p className="text-muted-foreground text-xs line-clamp-2 mb-4">{blog.excerpt}</p>

        <div className="mt-auto">
            <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs px-4 py-2 rounded w-fit hover:bg-primary/90 h-auto">
                 <Link href={`/blog/${blog.id}`}>Read More</Link>
            </Button>
        </div>

         <div className="flex items-center gap-2 mt-4 pt-4 border-t text-xs text-muted-foreground">
            {authorImage && (
                <Avatar className="h-6 w-6">
                    <AvatarImage src={authorImage.imageUrl} alt={blog.author.name} />
                    <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
            )}
            <span>Written by {blog.author.name}</span>
        </div>
      </div>
    </div>
  );
}

export function BlogSection({ blogs }: { blogs: Blog[] }) {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <h2 className="text-3xl font-bold mb-10 text-center">
          The latest blogs, podcasts, and real estate insights
        </h2>
        <div className="text-center">
          <div className="inline-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-12">
          <Button size="lg" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90">
            Show More
          </Button>
        </div>
      </div>
    </section>
  );
}
