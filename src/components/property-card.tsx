import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BedDouble, Bath, Square, MapPin, MessageCircle, Calendar } from 'lucide-react';
import type { Property } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const Stat = ({ icon: Icon, value }: { icon: React.ElementType; value: React.ReactNode }) => (
  <div className="flex items-center gap-1 text-xs text-muted-foreground">
    <Icon className="h-4 w-4" />
    <span>{value}</span>
  </div>
);

export function PropertyCard({ property }: { property: Property }) {
  const placeholderImage = PlaceHolderImages.find(p => p.id === property.imageId);

  return (
    <Card className="overflow-hidden group h-full flex flex-col">
      <div className="relative aspect-[3/2] w-full">
        {placeholderImage && (
          <Image
            src={placeholderImage.imageUrl}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={placeholderImage.imageHint}
          />
        )}
        <div className="absolute top-2 right-2 bg-background/80 text-foreground px-2 py-1 text-xs font-semibold">
          {property.purpose}
        </div>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-lg leading-tight truncate">{property.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground truncate">{property.location}</p>
          </div>
          <p className="text-xl font-bold text-primary mt-2">{property.price}</p>
          <div className="flex items-center gap-4 mt-3 border-t pt-3">
            <Stat icon={BedDouble} value={`${property.bedrooms} Beds`} />
            <Stat icon={Bath} value={`${property.bathrooms} Baths`} />
            <Stat icon={Square} value={`${property.areaSqFt.toLocaleString()} sqft`} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button variant="outline" size="sm">
            <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
          </Button>
          <Button variant="default" size="sm" className="bg-primary text-primary-foreground">
            <Calendar className="mr-2 h-4 w-4" /> Schedule Viewing
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
