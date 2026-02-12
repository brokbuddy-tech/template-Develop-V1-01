import { Award, Briefcase, TrendingUp, Users, Languages, Globe } from 'lucide-react';

const Signal = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string, label: string }) => (
  <div className="flex flex-col items-center text-center">
    <Icon className="h-8 w-8 text-primary mb-2" />
    <p className="text-2xl md:text-3xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

export function TrustSignals() {
  const signals = [
    { icon: Award, value: '10+', label: 'Years Experience' },
    { icon: Briefcase, value: '20,000+', label: 'Transactions' },
    { icon: TrendingUp, value: 'AED 120B+', label: 'Total Value' },
    { icon: Users, value: '200+', label: 'Team Members' },
    { icon: Languages, value: '25+', label: 'Languages Spoken' },
    { icon: Globe, value: '3', label: 'Offices Worldwide' },
  ];

  return (
    <section className="bg-card">
      <div className="container py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {signals.map((signal, index) => (
            <Signal key={index} {...signal} />
          ))}
        </div>
      </div>
    </section>
  );
}
