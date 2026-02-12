import { Award, Briefcase, TrendingUp } from 'lucide-react';

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
  ];

  return (
    <section className="bg-card">
      <div className="container py-8">
        <div className="grid grid-cols-3 gap-8">
          {signals.map((signal, index) => (
            <Signal key={index} {...signal} />
          ))}
        </div>
      </div>
    </section>
  );
}
