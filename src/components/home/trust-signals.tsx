import { Award, Briefcase, TrendingUp, Users, Languages, Globe } from 'lucide-react';

const Signal = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string, label: string }) => (
  <div className="bg-card p-6 flex flex-col items-center justify-center text-center group h-full transition-all duration-300 hover:bg-accent cursor-pointer">
    <Icon className="h-8 w-8 text-primary mb-2 transition-transform duration-300 group-hover:scale-110" />
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
      <div className="container py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-border border-y border-border">
          {signals.map((signal, index) => (
            <Signal key={index} {...signal} />
          ))}
        </div>
      </div>
    </section>
  );
}
