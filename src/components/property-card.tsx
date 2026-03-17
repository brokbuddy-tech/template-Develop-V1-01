'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BedDouble, Bath, Square, MapPin, Phone, MessageCircle } from 'lucide-react';
import type { Property } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Stat = ({ icon: Icon, value }: { icon: React.ElementType; value: React.ReactNode }) => (
  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
    <Icon className="h-4 w-4" />
    <span>{value}</span>
  </div>
);

export function PropertyCard({ property }: { property: Property }) {
  const isMockImage = property.imageId.startsWith('property-');
  const imageUrl = isMockImage 
      ? PlaceHolderImages.find(p => p.id === property.imageId)?.imageUrl 
      : property.imageId;

  const isMockAgent = property.agent?.avatarId?.startsWith('author-');
  const agentImageUrl = isMockAgent 
      ? PlaceHolderImages.find(p => p.id === property.agent?.avatarId)?.imageUrl 
      : property.agent?.avatarId;
  
  const handleContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    // In a real app, you'd trigger a call or open WhatsApp
    console.log('Contact button clicked for ' + property.agent?.name);
  }

  return (
    <Link href={`/property/${property.id}`} className="block group h-full">
      <Card className="overflow-hidden h-full flex flex-col rounded-xl border-border/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Media Header */}
        <div className="relative aspect-[16/9] w-full">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={property.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          <div className="absolute top-3 left-3 bg-background/80 text-foreground px-2 py-1 text-xs font-semibold rounded-md backdrop-blur-sm">
            {property.type}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        
        <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
                {/* Property Details */}
                <h3 className="font-bold text-base leading-tight">
                {property.bedrooms > 0 ? `${property.bedrooms} Bed ` : ''}{property.type} For {property.purpose} In {property.location}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <p className="text-xs text-muted-foreground truncate">{property.name}</p>
                </div>
                <div className="flex items-center gap-4 mt-3 border-t pt-3">
                <Stat icon={BedDouble} value={property.bedrooms > 0 ? `${property.bedrooms} Beds` : 'Studio'} />
                <Stat icon={Bath} value={`${property.bathrooms} Baths`} />
                <Stat icon={Square} value={`${property.areaSqFt.toLocaleString()} sqft`} />
                </div>

                {/* Pricing Section */}
                <div className="bg-muted/50 -mx-4 px-4 py-3 mt-4">
                    <p className="text-xl font-bold text-foreground">{property.price}</p>
                </div>
            </div>
  
            {/* Agent & Lead Footer */}
            {property.agent && (
                <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {agentImageUrl && (
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={agentImageUrl} alt={property.agent.name} />
                        <AvatarFallback>{property.agent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    )}
                    <div>
                    <p className="text-xs text-muted-foreground">Listed By</p>
                    <p className="text-sm font-semibold text-foreground">{property.agent.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-muted-foreground/50" onClick={handleContactClick}>
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-muted-foreground/50 text-[#25D366] hover:bg-[#25D366]/20" onClick={handleContactClick}>
                    <MessageCircle className="h-4 w-4" />
                    </Button>
                </div>
                </div>
            )}
        </div>
      </Card>
    </Link>
  );
}
