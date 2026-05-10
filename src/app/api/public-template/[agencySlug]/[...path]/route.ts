import { dynamic, proxyTemplateRequest } from '../template-route';

export { dynamic };

type RouteContext = {
  params: Promise<{
    agencySlug: string;
    path: string[];
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { agencySlug, path } = await context.params;
  return proxyTemplateRequest(request, agencySlug, path);
}

export async function POST(request: Request, context: RouteContext) {
  const { agencySlug, path } = await context.params;
  return proxyTemplateRequest(request, agencySlug, path);
}

export async function PUT(request: Request, context: RouteContext) {
  const { agencySlug, path } = await context.params;
  return proxyTemplateRequest(request, agencySlug, path);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { agencySlug, path } = await context.params;
  return proxyTemplateRequest(request, agencySlug, path);
}

export async function DELETE(request: Request, context: RouteContext) {
  const { agencySlug, path } = await context.params;
  return proxyTemplateRequest(request, agencySlug, path);
}

export async function OPTIONS(request: Request, context: RouteContext) {
  const { agencySlug, path } = await context.params;
  return proxyTemplateRequest(request, agencySlug, path);
}
