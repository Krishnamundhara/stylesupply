import { NextRequest } from 'next/server';
import { proxyGet, proxyPatch } from '../_lib/proxy';

export async function GET(request: NextRequest) {
  return proxyGet('/api/profile', request);
}

export async function PATCH(request: NextRequest) {
  return proxyPatch('/api/profile', request);
}
