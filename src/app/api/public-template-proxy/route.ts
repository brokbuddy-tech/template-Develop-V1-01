import type { NextRequest } from 'next/server';
import { dynamic, proxyAgencyRequest } from './proxy-route';

export { dynamic };

export async function GET(request: NextRequest) {
  return proxyAgencyRequest(request, []);
}

export async function POST(request: NextRequest) {
  return proxyAgencyRequest(request, []);
}

export async function PUT(request: NextRequest) {
  return proxyAgencyRequest(request, []);
}

export async function PATCH(request: NextRequest) {
  return proxyAgencyRequest(request, []);
}

export async function DELETE(request: NextRequest) {
  return proxyAgencyRequest(request, []);
}

export async function OPTIONS(request: NextRequest) {
  return proxyAgencyRequest(request, []);
}
