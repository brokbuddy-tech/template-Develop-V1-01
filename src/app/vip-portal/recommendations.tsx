'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recommendProperties, AIPropertyRecommendationsInput, AIPropertyRecommendationsOutput } from '@/ai/flows/ai-property-recommendations';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { PropertyCard } from '@/components/property-card';
import type { Property } from '@/lib/types';
import { z } from 'zod';

const FormSchema = z.object({
  searchHistory: z.string().describe('Comma-separated list of past searches (e.g., "3 bedroom villa in Jumeirah", "waterfront apartment")'),
  savedProperties: z.string().describe('Comma-separated list of saved properties (e.g., "Burj Khalifa apartment", "Palm villa")'),
});

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<AIPropertyRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      searchHistory: '',
      savedProperties: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setRecommendations(null);

    const input: AIPropertyRecommendationsInput = {
      userId: 'vip-user-001',
      searchHistory: data.searchHistory.split(',').map(s => s.trim()).filter(Boolean),
      savedProperties: data.savedProperties.split(',').map(s => s.trim()).filter(Boolean),
      explicitPreferences: {
        luxuryVsStandard: 'Luxury',
        furnishedVsUnfurnished: 'Furnished',
      },
    };

    try {
      const result = await recommendProperties(input);
      setRecommendations(result);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Helper to adapt AI output to PropertyCard format
  const adaptToPropertyCard = (rec: AIPropertyRecommendationsOutput['recommendations'][0]): Property => ({
    id: rec.id,
    name: rec.name,
    type: rec.type as Property['type'],
    category: 'Apartment', // Default or derived
    purpose: 'Buy',
    status: 'Ready',
    price: rec.price,
    priceNumeric: 0,
    bedrooms: rec.bedrooms || 0,
    bathrooms: rec.bathrooms || 0,
    areaSqFt: rec.areaSqFt || 0,
    imageId: `property-${(Math.floor(Math.random() * 6) + 1)}`,
    location: rec.location,
    description: '',
    amenities: [],
    galleryImageIds: [],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          AI-Powered Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="searchHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Past Searches</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., 3 bedroom villa in Jumeirah, waterfront apartment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="savedProperties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saved Property Interests</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Burj Khalifa apartment, Palm villa with sea view" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate My Recommendations
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Our AI is curating your personalized list...</p>
          </div>
        )}

        {recommendations && recommendations.recommendations.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-center">Your Personalized Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.recommendations.map((rec) => (
                <PropertyCard key={rec.id} property={adaptToPropertyCard(rec)} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
