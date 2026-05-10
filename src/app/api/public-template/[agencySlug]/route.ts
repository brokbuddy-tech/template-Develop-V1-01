import { dynamic, proxyTemplateRequest } from './template-route';

export { dynamic };

type RouteContext = {
  params: Promise<{
    agencySlug: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { agencySlug } = await context.params;
  return proxyTemplateRequest(request, agencySlug, []);
}

export async function POST(request: Request, context: RouteContext) {
  const { agencySlug } = await context.params;
  return proxyTemplateRequest(request, agencySlug, []);
}

export async function PUT(request: Request, context: RouteContext) {
  const { agencySlug } = await context.params;
  return proxyTemplateRequest(request, agencySlug, []);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { agencySlug } = await context.params;
  return proxyTemplateRequest(request, agencySlug, []);
}

export async function DELETE(request: Request, context: RouteContext) {
  const { agencySlug } = await context.params;
  return proxyTemplateRequest(request, agencySlug, []);
}

export async function OPTIONS(request: Request, context: RouteContext) {
  const { agencySlug } = await context.params;
  return proxyTemplateRequest(request, agencySlug, []);
}
