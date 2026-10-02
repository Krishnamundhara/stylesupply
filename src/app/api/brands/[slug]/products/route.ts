import { type NextRequest } from 'next/server';
import { proxyGet } from '../../../_lib/proxy';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return proxyGet(`/api/brands/${slug}/products`, request);
}
