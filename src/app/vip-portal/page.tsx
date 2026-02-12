import { Crown } from "lucide-react";
import AIRecommendations from "./recommendations";

export default function VIPPortalPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <Crown className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">VIP Portal</h1>
        <p className="text-muted-foreground mt-2">
          Exclusive access to off-market properties and personalized insights.
        </p>
      </div>
      
      <AIRecommendations />

      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Off-Market Listings</h2>
        <div className="p-16 text-center border border-dashed border-border text-muted-foreground">
          Exclusive property listings for VIP members would be displayed here.
        </div>
      </div>
    </div>
  );
}
