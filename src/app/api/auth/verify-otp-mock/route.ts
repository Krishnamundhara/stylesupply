import { NextRequest } from 'next/server';
import { proxyPost } from '../../_lib/proxy';

export async function POST(request: NextRequest) {
  return proxyPost('/api/auth/verify-otp-mock', request);
}
