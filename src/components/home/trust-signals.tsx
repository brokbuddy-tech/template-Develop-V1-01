import { Award, Briefcase, TrendingUp, Users, Languages, Globe } from 'lucide-react';

const Signal = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string, label: string }) => (
  <div className="bg-card p-4 flex flex-col items-center justify-center text-center group h-full cursor-pointer">
    <Icon className="h-6 w-6 text-primary mb-1 transition-transform duration-300 ease-out group-hover:scale-110" />
    <p className="text-xl md:text-2xl font-bold transition-transform duration-300 ease-out group-hover:scale-105">{value}</p>
    <p className="text-xs text-muted-foreground transition-transform duration-300 ease-out group-hover:scale-105">{label}</p>
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
      <div className="py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {signals.map((signal, index) => (
            <Signal key={index} {...signal} />
          ))}
        </div>
      </div>
    </section>
  );
}
