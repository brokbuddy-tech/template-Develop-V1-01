import { DevelopAgentProfilePageContent } from "@/components/public/agency-agent-profile-page";

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ agentSlug: string }>;
}) {
  const { agentSlug } = await params;
  return <DevelopAgentProfilePageContent agentSlug={agentSlug} />;
}
