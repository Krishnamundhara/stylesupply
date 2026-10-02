import { type NextRequest } from 'next/server';
import { proxyGet } from '../../_lib/proxy';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyGet(`/api/products/${id}`, request);
}
