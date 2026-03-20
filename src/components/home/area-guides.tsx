
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { Area } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface AreaGuidesProps {
  title: string;
  guides: Area[];
}

export function AreaGuides({ title, guides }: AreaGuidesProps) {
  return (
    <section className="py-16 bg-card">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {guides.map((guide) => {
            const guideImage = guide.imageId ? (guide.imageId.startsWith('http') ? { imageUrl: guide.imageId, id: 'api', imageHint: '' } : PlaceHolderImages.find(p => p.id === guide.imageId)) : null;
            return (
              <Link href={`/areas/${guide.id}`} key={guide.id} className="group">
                <Card className="overflow-hidden relative h-64 border-0">
                  {guideImage ? (
                    <Image
                      src={guideImage.imageUrl}
                      alt={guide.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={guideImage.imageHint}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">{guide.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <CardContent className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-bold">{guide.name}</h3>
                    <p className="text-sm">{guide.yield}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
