
import { Building, ShieldCheck, Home } from 'lucide-react';

const services = [
  {
    icon: Building,
    title: 'Property Brokerage',
    description: 'Expert guidance for buying, selling, and leasing properties in Dubai\'s dynamic market.',
  },
  {
    icon: ShieldCheck,
    title: 'Property Management',
    description: 'Comprehensive management services to protect your investment and maximize returns.',
  },
  {
    icon: Home,
    title: 'Interior Design',
    description: 'Luxury fit-out and interior design solutions to create exceptional living spaces.',
  },
];

export function DevelopEcosystem() {
  return (
    <section className="py-16">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-2">The DEVELOP Ecosystem</h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          A holistic suite of services designed to cover every aspect of your real estate journey.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="text-center p-6 border border-border">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 border border-primary/20">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
