
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Agent } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { testimonials, awards } from '@/lib/data';
import { Testimonials } from '@/components/home/testimonials';
import { AwardsSection } from '@/components/awards-section';

const teamMembers: Agent[] = [
  {
    id: 'agent-1',
    name: 'Johnathan Doe',
    specialization: 'Founder & CEO',
    languages: ['English', 'Arabic'],
    imageId: 'agent-1',
  },
  {
    id: 'agent-2',
    name: 'Jane Smith',
    specialization: 'Head of Sales',
    languages: ['English', 'Russian'],
    imageId: 'agent-2',
  },
    {
    id: 'agent-3',
    name: 'Chen Wang',
    specialization: 'International Markets',
    languages: ['Mandarin', 'English'],
    imageId: 'agent-3',
  },
];

const otherTeamMembers: Agent[] = [
  {
    id: 'agent-4',
    name: 'Michael Brown',
    specialization: 'Sales Specialist',
    languages: ['English', 'French'],
    imageId: 'author-3',
  },
  {
    id: 'agent-5',
    name: 'Sarah Wilson',
    specialization: 'Rental Expert',
    languages: ['English', 'Spanish'],
    imageId: 'author-4',
  },
  {
    id: 'agent-6',
    name: 'David Garcia',
    specialization: 'Off-Plan Advisor',
    languages: ['Spanish', 'English'],
    imageId: 'agent-1',
  },
  {
    id: 'agent-7',
    name: 'Emily Chen',
    specialization: 'Commercial Real Estate',
    languages: ['Mandarin', 'English'],
    imageId: 'author-2',
  },
  {
    id: 'agent-8',
    name: 'Fatima Al-Fahim',
    specialization: 'Luxury Properties',
    languages: ['Arabic', 'English'],
    imageId: 'testimonial-2',
  },
  {
    id: 'agent-9',
    name: 'Andrei Volkov',
    specialization: 'International Sales',
    languages: ['Russian', 'English'],
    imageId: 'testimonial-1',
  },
];


export default function AboutPage() {
  const aboutBgImage = PlaceHolderImages.find(p => p.id === 'about-us-background');

  return (
    <div className="relative">
      <div className="absolute inset-0 h-[50vh]">
        {aboutBgImage && (
          <Image
            src={aboutBgImage.imageUrl}
            alt={aboutBgImage.description}
            fill
            className="object-cover"
            data-ai-hint={aboutBgImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative container pt-24 pb-12 md:pt-48 md:pb-24">
        <div className="text-center mb-12 text-white">
          <h1 className="text-4xl font-bold tracking-tight">About DEVELOP</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
            Pioneering the future of luxury real estate in Dubai with data-driven insights and unparalleled client service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:mx-16 mb-16">
          <Card className="bg-card/80 backdrop-blur-sm border-border rounded-[10px]">
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">To redefine the real estate experience by providing exceptional service, leveraging cutting-edge technology, and offering data-driven market insights. We empower our clients to make informed decisions and achieve their property aspirations with confidence.</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-border rounded-[10px]">
            <CardHeader>
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">To be the most trusted and innovative luxury real estate brokerage in Dubai, recognized for our market leadership, integrity, and commitment to creating lasting value for our clients, partners, and the community.</p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:mx-16">
            <h2 className="text-3xl font-bold text-center mb-8">Meet Our Leadership</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map(member => {
                    const memberImage = PlaceHolderImages.find(p => p.id === member.imageId);
                    return (
                        <Card key={member.id} className="text-center bg-card">
                            <CardContent className="flex flex-col items-center pt-6">
                                {memberImage && (
                                     <Avatar className="h-24 w-24 mb-4">
                                        <AvatarImage src={memberImage.imageUrl} alt={member.name} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                                <h3 className="text-lg font-semibold">{member.name}</h3>
                                <p className="text-primary">{member.specialization}</p>
                                <p className="text-sm text-muted-foreground mt-2">{member.languages.join(' | ')}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
        
        <Separator className="my-16" />

        <div className="lg:mx-16">
            <h2 className="text-3xl font-bold text-center mb-8">Meet Our Expert Agents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherTeamMembers.map(member => {
                    const memberImage = PlaceHolderImages.find(p => p.id === member.imageId);
                    return (
                        <Card key={member.id} className="text-center bg-card">
                            <CardContent className="flex flex-col items-center pt-6">
                                {memberImage && (
                                     <Avatar className="h-24 w-24 mb-4">
                                        <AvatarImage src={memberImage.imageUrl} alt={member.name} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                                <h3 className="text-lg font-semibold">{member.name}</h3>
                                <p className="text-primary">{member.specialization}</p>
                                <p className="text-sm text-muted-foreground mt-2">{member.languages.join(' | ')}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
      </div>
      <AwardsSection awards={awards} />
      <Testimonials testimonials={testimonials} />
    </div>
  );
}
