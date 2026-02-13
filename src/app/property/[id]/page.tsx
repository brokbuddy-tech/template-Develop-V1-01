
import { properties } from '@/lib/data';
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
    const agentImage = PlaceHolderImages.find(p => p.id === agent.avatarId);
    return (
        <Card>
            <CardHeader className="text-center p-3">
                <Avatar className="h-10 w-10 mx-auto mb-2">
                    {agentImage && <AvatarImage src={agentImage.imageUrl} alt={agent.name} />}
                    <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-sm">{agent.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3 pt-0">
                <Button size="sm" className="w-full text-xs"><Phone className="mr-2 h-3 w-3" /> Call Agent</Button>
                <Button size="sm" className="w-full text-xs" variant="outline"><Mail className="mr-2 h-3 w-3" /> Email Agent</Button>
                <Button size="sm" className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white text-xs"><MessageCircle className="mr-2 h-3 w-3" /> WhatsApp</Button>
            </CardContent>
        </Card>
    );
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
    const property = properties.find(p => p.id === params.id);

    if (!property) {
        notFound();
    }

    const relatedProperties = properties.filter(p => p.type === property.type && p.id !== property.id).slice(0, 6);
    
    return (
        <div className="bg-background">
            <div className="w-full">
                <PropertyGallery galleryImageIds={property.galleryImageIds} />
            </div>
            <div className="container py-8">
                <div className="mb-4">
                    <Link href="/buy" className="text-sm text-primary hover:underline">‹ Back to listings</Link>
                </div>

                <div className="mb-4">
                    <p className="text-3xl font-bold text-primary">{property.price}</p>
                </div>
                
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight">{property.name}</h1>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                        <MapPin className="h-5 w-5" />
                        <span>{property.location}</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Property Details</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Stat icon={BedDouble} value={property.bedrooms > 0 ? property.bedrooms : 'Studio'} label="Bedrooms" />
                                <Stat icon={Bath} value={property.bathrooms} label="Bathrooms" />
                                <Stat icon={Square} value={property.areaSqFt.toLocaleString()} label="Area (sqft)" />
                                <Stat icon={Building} value={property.type} label="Type" />
                            </div>
                        </div>

                        <Separator className="my-8" />
                        
                        <div>
                           <h2 className="text-2xl font-bold mb-4">Description</h2>
                           <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                        </div>
                        
                        <Separator className="my-8" />

                        <div>
                           <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {property.amenities.map(amenity => (
                                    <div key={amenity} className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        <span className="text-muted-foreground">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator className="my-8" />

                        <MortgageCalculator propertyPriceString={property.price} />

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
                           <AgentContactCard agent={property.agent} />
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
                                    {relatedProperties.map((property) => (
                                    <CarouselItem key={property.id} className="md:basis-1/2 lg:basis-1/3">
                                        <div className="p-1 h-full">
                                        <PropertyCard property={property} />
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
