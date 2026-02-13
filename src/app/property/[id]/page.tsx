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
            <CardHeader className="text-center p-4">
                <Avatar className="h-20 w-20 mx-auto mb-2">
                    {agentImage && <AvatarImage src={agentImage.imageUrl} alt={agent.name} />}
                    <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{agent.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-0">
                <Button className="w-full"><Phone className="mr-2 h-4 w-4" /> Call Agent</Button>
                <Button className="w-full" variant="outline"><Mail className="mr-2 h-4 w-4" /> Email Agent</Button>
                <Button className="w-full" className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"><MessageCircle className="mr-2 h-4 w-4" /> WhatsApp</Button>
            </CardContent>
        </Card>
    );
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
    const property = properties.find(p => p.id === params.id);

    if (!property) {
        notFound();
    }
    
    return (
        <div className="bg-background">
            <div className="container py-12">
                <div className="mb-4">
                    <Link href="/buy" className="text-sm text-primary hover:underline">‹ Back to listings</Link>
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
                        <PropertyGallery galleryImageIds={property.galleryImageIds} />
                        
                        <Separator className="my-8" />

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

                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                           <Card className="bg-primary/5 border-primary/20">
                               <CardHeader className="p-4">
                                   <CardTitle className="text-center text-lg">Price</CardTitle>
                               </CardHeader>
                               <CardContent className="p-4 pt-0">
                                   <p className="text-3xl font-bold text-center text-primary">{property.price}</p>
                               </CardContent>
                           </Card>
                           <AgentContactCard agent={property.agent} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
