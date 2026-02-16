
'use client';

import * as React from 'react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Check, CheckCircle, Phone, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FloatingSocialBar } from './floating-social-bar';

const BuyerVerificationCard = () => (
    <div className="relative w-full max-w-sm mx-auto">
        <div className="absolute -top-12 -right-12 bg-green-500/80 text-white p-6 rounded-full shadow-lg backdrop-blur-sm">
            <Check className="h-12 w-12" />
        </div>
        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl">
            <div className="h-2.5 bg-blue-600 rounded-t-lg -m-6 mb-6"></div>
            <h3 className="font-bold text-white mb-4">Buyer Verification</h3>
            <ul className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Verified Buyer Profile Point</span>
                    </li>
                ))}
            </ul>
        </div>
         <div className="absolute -bottom-6 -left-6 bg-blue-600/80 text-white p-4 rounded-full shadow-lg backdrop-blur-sm">
            <Phone className="h-8 w-8" />
        </div>
    </div>
);


const WorldMap = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <Globe className="w-full h-auto max-w-md text-emerald-400 opacity-50" strokeWidth={0.5} />
         {/* Pulses */}
        <div className="absolute top-[45%] left-[51%]">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
            <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full"></div>
        </div>
         <div className="absolute top-[35%] left-[25%]">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping delay-200"></div>
             <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full"></div>
        </div>
        <div className="absolute top-[30%] left-[80%]">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping delay-500"></div>
            <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full"></div>
        </div>
    </div>
);


export function WhySell() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="bg-black text-white relative py-24 sm:py-32">
        <FloatingSocialBar />
        <div className="container">
            <h2 className="text-4xl lg:text-5xl font-bold mb-16">Why Sell with DEVELOP?</h2>

            <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                    {/* Slide 1 */}
                    <CarouselItem>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold">Top Quality Buyers</h3>
                                <p className="text-gray-300">We rigorously screen prospective buyers to ensure that you receive the most qualified opportunities.</p>
                            </div>
                            <div>
                                <BuyerVerificationCard />
                            </div>
                        </div>
                    </CarouselItem>
                    {/* Slide 2 */}
                    <CarouselItem>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold">Unmatched Market Exposure</h3>
                                <p className="text-gray-300">Leveraging our network of 1000+ local and international agencies to find the right investor for your asset.</p>
                            </div>
                             <div className="h-80">
                                <WorldMap />
                            </div>
                        </div>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
            
            {/* Custom Pagination */}
            <div className="flex gap-3 items-center mt-16">
                {Array.from({ length: count }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={cn(
                            'h-1.5 rounded-full transition-all duration-300',
                            current === index ? 'w-12 bg-white' : 'w-3 bg-gray-600'
                        )}
                    />
                ))}
            </div>
        </div>
    </section>
  );
}
