'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating personalized property recommendations.
 *
 * - recommendProperties: An asynchronous function that takes user preferences and history to recommend properties.
 * - AIPropertyRecommendationsInput: The input type for the recommendProperties function.
 * - AIPropertyRecommendationsOutput: The return type for the recommendProperties function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPropertyRecommendationsInputSchema = z.object({
  userId: z.string().describe('The ID of the user requesting recommendations.'),
  searchHistory: z.array(z.string()).describe('A list of past search queries or descriptions of properties the user has searched for.'),
  savedProperties: z.array(z.string()).describe('A list of names or brief descriptions of properties the user has saved.'),
  explicitPreferences: z.object({
    propertyType: z.array(z.string()).optional().describe('Preferred property types (e.g., "Apartment", "Villa", "Penthouse").'),
    location: z.array(z.string()).optional().describe('Preferred locations (e.g., "Downtown Dubai", "Palm Jumeirah").'),
    minPrice: z.number().optional().describe('Minimum desired price.'),
    maxPrice: z.number().optional().describe('Maximum desired price.'),
    bedrooms: z.number().optional().describe('Minimum number of bedrooms.'),
    luxuryVsStandard: z.enum(['Luxury', 'Standard']).optional().describe('Preference for luxury or standard properties.').default('Luxury'),
    furnishedVsUnfurnished: z.enum(['Furnished', 'Unfurnished']).optional().describe('Preference for furnished or unfurnished properties.').default('Furnished'),
    completionDate: z.string().optional().describe('Preferred completion date for off-plan properties (e.g., "Q4 2025").'),
  }).describe('Explicit preferences provided by the user for property recommendations.'),
});
export type AIPropertyRecommendationsInput = z.infer<typeof AIPropertyRecommendationsInputSchema>;

const AIPropertyRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.object({
    id: z.string().describe('Unique identifier for the property (e.g., "PROP-001").'),
    name: z.string().describe('Name or brief title of the property.'),
    type: z.string().describe('Type of property (e.g., "Apartment", "Villa", "Penthouse").'),
    location: z.string().describe('Specific location of the property in Dubai (e.g., "Business Bay", "Palm Jumeirah").'),
    price: z.string().describe('Price of the property (e.g., "AED 2.5M", "Upon Request").'),
    bedrooms: z.number().optional().describe('Number of bedrooms.'),
    bathrooms: z.number().optional().describe('Number of bathrooms.'),
    areaSqFt: z.number().optional().describe('Area in square feet.'),
    description: z.string().describe('A brief description highlighting why this property is recommended and its key features.'),
    imageUrl: z.string().url().optional().describe('URL to an image of the property.'),
  })).describe('A list of recommended properties based on user preferences and history.'),
});
export type AIPropertyRecommendationsOutput = z.infer<typeof AIPropertyRecommendationsOutputSchema>;

const propertyRecommendationsPrompt = ai.definePrompt({
  name: 'propertyRecommendationsPrompt',
  input: { schema: AIPropertyRecommendationsInputSchema },
  output: { schema: AIPropertyRecommendationsOutputSchema },
  prompt: `You are an expert real estate agent specializing in luxury properties in Dubai. Your task is to provide personalized property recommendations based on a user's past interactions and explicit preferences.

Here is the user's information:
User ID: {{{userId}}}

User's search history:
{{#each searchHistory}}- {{{this}}}
{{/each}}

User's saved properties:
{{#each savedProperties}}- {{{this}}}
{{/each}}

User's explicit preferences:
{{#if explicitPreferences.propertyType}}Property Types: {{explicitPreferences.propertyType}}
{{/if}}{{#if explicitPreferences.location}}Locations: {{explicitPreferences.location}}
{{/if}}{{#if explicitPreferences.minPrice}}Minimum Price: AED {{explicitPreferences.minPrice}}
{{/if}}{{#if explicitPreferences.maxPrice}}Maximum Price: AED {{explicitPreferences.maxPrice}}
{{/if}}{{#if explicitPreferences.bedrooms}}Minimum Bedrooms: {{explicitPreferences.bedrooms}}
{{/if}}{{#if explicitPreferences.luxuryVsStandard}}Luxury vs Standard: {{explicitPreferences.luxuryVsStandard}}
{{/if}}{{#if explicitPreferences.furnishedVsUnfurnished}}Furnished vs Unfurnished: {{explicitPreferences.furnishedVsUnfurnished}}
{{/if}}{{#if explicitPreferences.completionDate}}Completion Date: {{explicitPreferences.completionDate}}
{{/if}}

Based on this information, generate a list of 3-5 unique and personalized luxury property recommendations in Dubai. For each recommendation, provide an ID, a descriptive name, type, a specific location in Dubai, an estimated price in AED, number of bedrooms, bathrooms, area in Sq. Ft., a brief description highlighting its appeal, and a placeholder image URL. Ensure the recommendations are distinct and cater to the user's stated interests, prioritizing luxury and investment potential. If no specific preferences are given, recommend popular luxury properties in prime Dubai locations.
  `,
});

const aiPropertyRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiPropertyRecommendationsFlow',
    inputSchema: AIPropertyRecommendationsInputSchema,
    outputSchema: AIPropertyRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await propertyRecommendationsPrompt(input);
    return output!;
  }
);

export async function recommendProperties(input: AIPropertyRecommendationsInput): Promise<AIPropertyRecommendationsOutput> {
  return aiPropertyRecommendationsFlow(input);
}
