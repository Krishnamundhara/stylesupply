import { type NextRequest } from 'next/server';
import { proxyGet, proxyPost } from '../_lib/proxy';

export async function GET(request: NextRequest) {
  return proxyGet('/api/wishlist', request);
}

export async function POST(request: NextRequest) {
  return proxyPost('/api/wishlist', request);
}
