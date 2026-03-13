import { Award, Briefcase, TrendingUp, Users, Languages, Globe } from 'lucide-react';

const Signal = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string, label: string }) => (
  <div className="mx-6 flex flex-col items-center justify-center text-center p-2 flex-shrink-0">
    <Icon className="h-5 w-5 text-primary mb-1" />
    <p className="text-lg font-bold">{value}</p>
    <p className="text-[11px] text-center leading-tight text-muted-foreground w-20">{label}</p>
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
    <section className="bg-card relative flex overflow-x-hidden group">
      <div className="py-8 animate-marquee whitespace-nowrap flex items-center group-hover:[animation-play-state:paused]">
        {signals.map((signal, index) => (
          <Signal key={index} {...signal} />
        ))}
      </div>
      <div className="absolute top-0 py-8 animate-marquee2 whitespace-nowrap flex items-center group-hover:[animation-play-state:paused]">
        {signals.map((signal, index) => (
          <Signal key={`marquee-${index}`} {...signal} />
        ))}
      </div>
    </section>
  );
}
