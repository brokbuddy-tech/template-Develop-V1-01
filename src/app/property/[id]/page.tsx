import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BedDouble, Bath, Square, MapPin, Phone, MessageCircle, Building, Check, Mail, FileText, ArrowRight } from 'lucide-react';
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
import { LocationMapShell } from '@/components/location-map-shell';
import { prefixAgencyPath } from '@/lib/agency-routing';
import { getRequestAgencySlug } from '@/lib/server-agency';
import { PropertyBrochureButton } from '@/components/property-brochure-button';
import type { Property, PropertyAgent } from '@/lib/types';

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

type AgentCardProperty = Pick<
    Property,
    'id' | 'name' | 'price' | 'location' | 'description' | 'areaSqFt' | 'bedrooms' | 'bathrooms' | 'galleryImages' | 'amenities' | 'purpose'
>;

function getAgentInitials(name: string) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('') || 'AG';
}

function getWhatsAppHref(value?: string | null, propertyName?: string) {
    if (!value) return null;
    const digits = value.replace(/\D/g, '');
    if (!digits) return null;

    const message = propertyName
        ? `Hi, I am interested in ${propertyName}. Please share more details.`
        : null;

    return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

function AgentContactCard({
    agent,
    property,
    agencySlug,
}: {
    agent?: PropertyAgent;
    property: AgentCardProperty;
    agencySlug?: string | null;
}) {
    if (!agent) return null;
    const isMockAvatar = agent.avatarId && agent.avatarId.startsWith('author-');
    const agentImageUrl = agent.avatarUrl || (
        isMockAvatar
            ? PlaceHolderImages.find(p => p.id === agent.avatarId)?.imageUrl
            : agent.avatarId
    );
    const brochureGallery = (property.galleryImages || [])
        .map((image) => typeof image === 'string' ? image : image.src)
        .filter(Boolean);
    const whatsappHref = getWhatsAppHref(agent.whatsapp || agent.phone, property.name);
    const phoneHref = agent.phone ? `tel:${agent.phone}` : null;
    const emailHref = agent.email
        ? `mailto:${agent.email}?subject=${encodeURIComponent(`Inquiry about ${property.name}`)}`
        : null;
    const inquiryHref = prefixAgencyPath(`/contact?listingId=${encodeURIComponent(property.id)}`, agencySlug);
    const availabilityCopy = agent.propertyCount
        ? `${agent.propertyCount}+ live listings`
        : 'Private viewings available';

    return (
        <Card className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_56px_-34px_rgba(15,23,42,0.35)]">
            <CardContent className="p-0">
                <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-white px-5 pb-5 pt-4 sm:px-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-primary-foreground">
                            Listing Advisor
                        </span>
                        {agent.orn ? (
                            <span className="inline-flex rounded-full border border-primary/15 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                                ORN {agent.orn}
                            </span>
                        ) : null}
                    </div>

                    <div className="mt-4 flex items-center gap-3.5">
                        <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-white bg-white shadow-sm">
                            {agentImageUrl ? (
                                <Image
                                    src={agentImageUrl}
                                    alt={agent.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <span className="text-lg font-bold text-primary">{getAgentInitials(agent.name)}</span>
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/70">
                                {agent.company || 'Real Estate Brokerage'}
                            </p>
                            <h3 className="mt-1.5 text-[1.75rem] font-bold tracking-tight leading-tight text-slate-900">{agent.name}</h3>
                            <p className="mt-1 text-[15px] text-muted-foreground">
                                {agent.title || 'Property Consultant'}
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-[15px] leading-6 text-slate-600">
                        Get the brochure, arrange a viewing, or speak directly with the listing specialist for this{' '}
                        {property.purpose.toLowerCase()} opportunity.
                    </p>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                        <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-400">Phone</p>
                            <p className="mt-1.5 text-sm font-semibold text-slate-800">
                                {agent.phone || 'Shared after inquiry'}
                            </p>
                        </div>
                        <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-400">Availability</p>
                            <p className="mt-1.5 text-sm font-semibold text-slate-800">{availabilityCopy}</p>
                        </div>
                        {agent.email ? (
                            <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 sm:col-span-2 lg:col-span-1">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-400">Email</p>
                                <p className="mt-1.5 break-all text-sm font-semibold text-slate-800">{agent.email}</p>
                            </div>
                        ) : null}
                    </div>

                    <div className="space-y-2.5">
                        <PropertyBrochureButton
                            brochure={{
                                title: property.name,
                                subtitle: property.location,
                                priceLabel: property.price,
                                description: property.description,
                                heroImage: brochureGallery[0] || null,
                                gallery: brochureGallery,
                                stats: [
                                    { label: 'Bedrooms', value: property.bedrooms > 0 ? `${property.bedrooms}` : 'Studio' },
                                    { label: 'Bathrooms', value: `${property.bathrooms}` },
                                    { label: 'Area', value: `${property.areaSqFt.toLocaleString()} sqft` },
                                ],
                                features: property.amenities,
                                agentName: agent.name,
                                agentTitle: agent.title,
                                agentImage: agentImageUrl || null,
                                company: agent.company,
                                contactPhone: agent.phone,
                                contactEmail: agent.email,
                            }}
                        >
                            <Button
                                variant="outline"
                                className="h-10 w-full rounded-xl border-primary/20 bg-primary/5 text-[12px] font-semibold uppercase tracking-[0.18em] text-primary hover:bg-primary/10 hover:text-primary"
                            >
                                <FileText className="h-4 w-4" />
                                Download Brochure
                            </Button>
                        </PropertyBrochureButton>

                        <Button asChild className="h-10 w-full rounded-xl text-sm font-semibold">
                            <Link href={inquiryHref}>
                                Contact Agent
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>

                        {(phoneHref || whatsappHref || emailHref) ? (
                            <div className="grid grid-cols-2 gap-3">
                                {phoneHref ? (
                                    <Button asChild variant="outline" className="h-10 rounded-xl font-semibold">
                                        <a href={phoneHref}>
                                            <Phone className="h-4 w-4" />
                                            Call
                                        </a>
                                    </Button>
                                ) : (
                                    <Button asChild variant="outline" className="h-10 rounded-xl font-semibold">
                                        <Link href={inquiryHref}>
                                            <Phone className="h-4 w-4" />
                                            Contact
                                        </Link>
                                    </Button>
                                )}

                                {whatsappHref ? (
                                    <Button asChild variant="outline" className="h-10 rounded-xl font-semibold">
                                        <a href={whatsappHref} target="_blank" rel="noreferrer">
                                            <MessageCircle className="h-4 w-4" />
                                            WhatsApp
                                        </a>
                                    </Button>
                                ) : emailHref ? (
                                    <Button asChild variant="outline" className="h-10 rounded-xl font-semibold">
                                        <a href={emailHref}>
                                            <Mail className="h-4 w-4" />
                                            Email
                                        </a>
                                    </Button>
                                ) : (
                                    <Button asChild variant="outline" className="h-10 rounded-xl font-semibold">
                                        <Link href={inquiryHref}>
                                            <MessageCircle className="h-4 w-4" />
                                            Message
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Ensure params is correctly treated as a promise in Next.js 15
export default async function PropertyDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const agencySlug = await getRequestAgencySlug();
    const property = await getPropertyById(params.id, agencySlug);

    if (!property) {
        return (
            <div className="w-full px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h1 className="text-3xl font-bold">Listing unavailable</h1>
                <p className="mt-3 text-muted-foreground">
                    This property could not be loaded from the live public feed.
                </p>
                <div className="mt-6">
                    <Link href="/buy" className="text-primary hover:underline">
                        Back to listings
                    </Link>
                </div>
            </div>
        );
    }

    const prop = property as NonNullable<typeof property>;

    const { properties: allProperties } = await getProperties(undefined, agencySlug);
    const relatedProperties = allProperties.filter(p => p.type === prop.type && p.id !== prop.id).slice(0, 6);

    return (
        <div className="bg-background">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                <PropertyGallery
                    propertyName={prop.name}
                    galleryImages={prop.galleryImages}
                    galleryImageIds={prop.galleryImageIds}
                    virtualTourUrl={prop.virtualTourUrl}
                />
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

                        <div>
                            <h2 className="text-2xl font-bold mb-4">Location</h2>
                            <LocationMapShell
                                latitude={prop.latitude}
                                longitude={prop.longitude}
                                locationLabel={prop.location}
                                addressLabel={prop.mapAddress}
                            />
                        </div>

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
                            <AgentContactCard agent={prop.agent} property={prop} agencySlug={agencySlug} />
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
