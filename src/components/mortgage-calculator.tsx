'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function parsePrice(price: string): number {
    if (!price) return 0;
    const numericString = price.replace(/[^0-9.]/g, '');
    let value = parseFloat(numericString);
    if (price.toLowerCase().includes('m')) {
        value *= 1000000;
    } else if (price.toLowerCase().includes('k')) {
        value *= 1000;
    }
    return isNaN(value) ? 0 : value;
}


export function MortgageCalculator({ propertyPriceString }: { propertyPriceString: string }) {
  const initialPrice = useMemo(() => parsePrice(propertyPriceString), [propertyPriceString]);
  
  const [propertyPrice, setPropertyPrice] = useState(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(25);

  useEffect(() => {
    setPropertyPrice(initialPrice);
  }, [initialPrice]);

  const downPaymentAmount = useMemo(() => (propertyPrice * downPaymentPercent) / 100, [propertyPrice, downPaymentPercent]);
  const loanAmount = useMemo(() => propertyPrice - downPaymentAmount, [propertyPrice, downPaymentAmount]);
  const monthlyInterestRate = useMemo(() => interestRate / 100 / 12, [interestRate]);
  const numberOfPayments = useMemo(() => loanTerm * 12, [loanTerm]);

  const monthlyPayment = useMemo(() => {
    if (loanAmount <= 0 || monthlyInterestRate <= 0 || numberOfPayments <= 0) {
      return 0;
    }
    const numerator = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
    if (denominator === 0) return 0;
    return numerator / denominator;
  }, [loanAmount, monthlyInterestRate, numberOfPayments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mortgage Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="propertyPrice">Property Price (AED)</Label>
              <Input
                id="propertyPrice"
                type="number"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="font-bold text-lg"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <Label>Down Payment</Label>
                <span className="font-semibold">{downPaymentPercent}%</span>
              </div>
              <Slider
                value={[downPaymentPercent]}
                onValueChange={(value) => setDownPaymentPercent(value[0])}
                min={10}
                max={80}
                step={1}
              />
               <p className="text-sm text-muted-foreground mt-2 text-right">{formatCurrency(downPaymentAmount)}</p>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <Label>Interest Rate</Label>
                <span className="font-semibold">{interestRate.toFixed(2)}%</span>
              </div>
              <Slider
                value={[interestRate]}
                onValueChange={(value) => setInterestRate(value[0])}
                min={1}
                max={10}
                step={0.01}
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <Label>Loan Term (Years)</Label>
                <span className="font-semibold">{loanTerm} years</span>
              </div>
              <Slider
                value={[loanTerm]}
                onValueChange={(value) => setLoanTerm(value[0])}
                min={5}
                max={30}
                step={1}
              />
            </div>
          </div>

          {/* Results */}
          <div className="bg-muted/50 rounded-lg p-6 flex flex-col justify-center items-center">
            <p className="text-sm text-muted-foreground">Estimated Monthly Payment</p>
            <p className="text-4xl font-bold text-primary mt-2">{formatCurrency(monthlyPayment)}</p>
            <div className="w-full mt-6 space-y-2 text-sm">
                <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Loan Amount</span>
                    <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Interest Paid</span>
                    <span className="font-semibold">{formatCurrency(monthlyPayment * numberOfPayments - loanAmount)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Payment</span>
                    <span className="font-semibold">{formatCurrency(monthlyPayment * numberOfPayments)}</span>
                </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
