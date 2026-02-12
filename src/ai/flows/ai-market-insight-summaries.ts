'use server';
/**
 * @fileOverview A Genkit flow for generating market trend summaries and detailed reports for specific areas or property types.
 *
 * - getMarketInsightSummaries - A function that handles the generation of market insights.
 * - MarketInsightInput - The input type for the getMarketInsightSummaries function.
 * - MarketInsightOutput - The return type for the getMarketInsightSummaries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketInsightInputSchema = z.object({
  area: z.string().describe('The geographical area for which to generate market insights (e.g., Downtown Dubai, Palm Jumeirah).'),
  propertyType: z.string().describe('The type of property for which to generate market insights (e.g., Apartments, Villas, Penthouses).'),
  includeDetailedReport: z.boolean().optional().describe('Whether to include a detailed report in addition to the concise summary. Defaults to false.'),
});
export type MarketInsightInput = z.infer<typeof MarketInsightInputSchema>;

const MarketInsightOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the market trends for the specified area and property type.'),
  detailedReport: z.string().optional().describe('A detailed report with in-depth analysis for the specified area and property type, if requested.'),
});
export type MarketInsightOutput = z.infer<typeof MarketInsightOutputSchema>;

export async function getMarketInsightSummaries(input: MarketInsightInput): Promise<MarketInsightOutput> {
  return marketInsightSummariesFlow(input);
}

const marketInsightPrompt = ai.definePrompt({
  name: 'marketInsightPrompt',
  input: {schema: MarketInsightInputSchema},
  output: {schema: MarketInsightOutputSchema},
  prompt: `You are an expert real estate market analyst specializing in the Dubai property market.
Your task is to provide market insights based on the specified area and property type.

Generate a concise summary of the current market trends, including demand, supply, price movements, and investment potential for '{{{propertyType}}}' in '{{{area}}}'.

{{#if includeDetailedReport}}
Additionally, provide a detailed report that elaborates on the summary, offering deeper analysis, key data points, and future outlook for '{{{propertyType}}}' in '{{{area}}}'.
{{/if}}

Area: {{{area}}}
Property Type: {{{propertyType}}}`,
});

const marketInsightSummariesFlow = ai.defineFlow(
  {
    name: 'marketInsightSummariesFlow',
    inputSchema: MarketInsightInputSchema,
    outputSchema: MarketInsightOutputSchema,
  },
  async (input) => {
    const {output} = await marketInsightPrompt(input);
    return output!;
  }
);
