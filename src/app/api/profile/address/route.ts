import { NextRequest } from 'next/server';
import { proxyPatch } from '../../_lib/proxy';

export async function PATCH(request: NextRequest) {
  return proxyPatch('/api/profile/address', request);
}
