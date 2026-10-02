import { type NextRequest } from 'next/server';
import { proxyGet, proxyDelete } from '../../_lib/proxy';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyGet(`/api/wishlist/${id}`, request);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyDelete(`/api/wishlist/${id}`, request);
}
