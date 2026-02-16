
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function AgentsPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Find an Agent</h1>
      <p className="text-muted-foreground mb-8">Connect with our expert agents specializing in your area of interest.</p>
      
      <div className="flex gap-2 mb-8">
        <Input placeholder="Search by neighborhood, language..." />
        <Button className="bg-primary text-primary-foreground"><Search className="mr-2 h-4 w-4" /> Search</Button>
      </div>

      <div className="mt-8">
        <p className="text-center text-muted-foreground">Agent directory would be displayed here.</p>
      </div>
    </div>
  );
}
