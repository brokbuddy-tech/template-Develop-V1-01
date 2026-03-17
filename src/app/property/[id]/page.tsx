import { notFound } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BedDouble, Bath, Square, MapPin, Phone, MessageCircle, Building, Check, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PropertyGallery } from '@/components/property-gallery';
import Link from 'next/link';
import { MortgageCalculator } from '@/components/mortgage-calculator';
import { PropertyCard } from '@/components/property-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';
import { getPropertyById, getProperties } from '@/lib/api';

function Stat({ icon: Icon, value, label }: { icon: React.ElementType, value: string | number, label: string }) {
    return (
        <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-primary">
                <Icon className="h-6 w-6" />
                <span className="text-2xl font-bold text-foreground">{value}</span>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-1">{label}</p>
        </div>
    )
}

function AgentContactCard({ agent }: { agent: any }) {
    if (!agent) return null;
    const isMockAvatar = agent.avatarId && agent.avatarId.startsWith('author-');
    const agentImageUrl = isMockAvatar ? PlaceHolderImages.find(p => p.id === agent.avatarId)?.imageUrl : agent.avatarId;

    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-muted p-2">
                <h3 className="text-center font-semibold text-sm text-muted-foreground">SELLER</h3>
            </CardHeader>
            <CardContent className="p-4 text-center">
                {agentImageUrl && (
                    <div className="relative h-48 w-full mb-4">
                        <Image
                            src={agentImageUrl}
                            alt={agent.name}
                            fill
                            className="object-cover rounded-md"
                        />
                    </div>
                )}
                <h4 className="font-bold text-lg">{agent.name}</h4>
                {agent.title && <p className="text-muted-foreground text-sm">{agent.title}</p>}
                {agent.company && <p className="font-semibold mt-2">{agent.company}</p>}
                {agent.orn && <p className="text-muted-foreground text-sm">ORN: {agent.orn}</p>}
                
                <Button variant="default" className="w-full mt-4">Contact</Button>
                
                {agent.propertyCount > 0 && (
                    <Link href="#" className="text-sm text-muted-foreground mt-2 block hover:underline">
                        {agent.propertyCount} properties more
                    </Link>
                )}
            </CardContent>
        </Card>
    );
}

// Ensure params is correctly treated as a promise in Next.js 15
export default async function PropertyDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const property = await getPropertyById(params.id);

    if (!property) {
        notFound();
    }

    const prop = property as NonNullable<typeof property>;

    const allProperties = await getProperties();
    const relatedProperties = allProperties.filter(p => p.type === prop.type && p.id !== prop.id).slice(0, 6);
    
    return (
        <div className="bg-background">
            <div className="w-full">
                <PropertyGallery galleryImageIds={prop.galleryImageIds} />
            </div>
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-4">
                    <Link href={prop.purpose === 'Rent' ? '/rent' : '/buy'} className="text-sm text-primary hover:underline">‹ Back to listings</Link>
                </div>

                <div className="mb-4">
                    <p className="inline-block bg-muted/50 p-3 rounded-lg text-3xl font-bold text-primary">{prop.price}</p>
                </div>
                
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{prop.name}</h1>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                        <MapPin className="h-5 w-5" />
                        <span>{prop.location}</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Property Details</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Stat icon={BedDouble} value={prop.bedrooms > 0 ? prop.bedrooms : 'Studio'} label="Bedrooms" />
                                <Stat icon={Bath} value={prop.bathrooms} label="Bathrooms" />
                                <Stat icon={Square} value={prop.areaSqFt.toLocaleString()} label="Area (sqft)" />
                                <Stat icon={Building} value={prop.type} label="Type" />
                            </div>
                        </div>

                        <Separator className="my-8" />
                        
                        <div>
                           <h2 className="text-2xl font-bold mb-4">Description</h2>
                           <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{prop.description}</p>
                        </div>
                        
                        <Separator className="my-8" />

                        {prop.amenities && prop.amenities.length > 0 && (
                            <>
                                <div>
                                <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {prop.amenities.map(amenity => (
                                            <div key={amenity} className="flex items-center gap-2">
                                                <Check className="h-5 w-5 text-primary" />
                                                <span className="text-muted-foreground">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Separator className="my-8" />
                            </>
                        )}

                        <MortgageCalculator propertyPriceString={prop.price} />

                        <Separator className="my-8" />

                        <Card>
                            <CardHeader>
                                <CardTitle>RERA Permit Information</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="w-32 h-32 bg-muted flex items-center justify-center rounded-md">
                                    <p className="text-xs text-muted-foreground">QR Code</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-muted-foreground">
                                        This listing is compliant with the Real Estate Regulatory Agency (RERA) regulations in Dubai.
                                    </p>
                                    <p className="text-muted-foreground mt-2">
                                        Scan the QR code to verify the official permit and view detailed property information on the DLD/Trakheesi system.
                                    </p>
                                    <p className="text-sm font-semibold mt-4">Permit No: <span className="font-mono bg-muted px-2 py-1 rounded-md">7117457559</span></p>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                           <AgentContactCard agent={prop.agent} />
                        </div>
                    </div>
                </div>

                {relatedProperties.length > 0 && (
                    <div className="mt-16">
                        <Separator />
                        <section className="py-16">
                            <h2 className="text-3xl font-bold text-center mb-8">You might also like</h2>
                            <Carousel
                                opts={{
                                    align: 'start',
                                    loop: true,
                                }}
                                className="w-full"
                            >
                                <CarouselContent>
                                    {relatedProperties.map((p) => (
                                    <CarouselItem key={p.id} className="md:basis-1/2 lg:basis-1/3">
                                        <div className="p-1 h-full">
                                        <PropertyCard property={p} />
                                        </div>
                                    </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="ml-12" />
                                <CarouselNext className="mr-12" />
                            </Carousel>
                        </section>
                    </div>
                )}
            </div>
        </div>
    )
}
