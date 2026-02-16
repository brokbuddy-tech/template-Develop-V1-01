
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';

export default function SellPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'blog-4');

  return (
    <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 py-12 md:py-24 min-h-[calc(100vh-64px)]">
            <div className="flex flex-col items-start text-left">
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground font-headline">
                    Sell Your Property in Dubai 2026 | Residential & Commercial
                </h1>
                <p className="mt-6 text-lg text-muted-foreground max-w-xl">
                    Unlock the true value of your property with our expert valuation, data-driven market insights, and unparalleled global marketing reach.
                </p>
                <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground rounded-none px-8 py-6 text-base font-semibold">
                    <Link href="/instant-valuation">
                        Get Instant Valuation
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
            <div className="relative h-80 md:h-[500px] w-full">
                {heroImage && (
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                />
                )}
            </div>
        </div>
    </div>
  );
}
