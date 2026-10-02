import { NextRequest } from 'next/server';
import { proxyPost } from '../../_lib/proxy';

export async function POST(request: NextRequest) {
  return proxyPost('/api/auth/check-email', request);
}
