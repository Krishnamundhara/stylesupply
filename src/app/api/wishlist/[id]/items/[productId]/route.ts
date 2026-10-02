import { type NextRequest } from 'next/server';
import { proxyDelete } from '../../../../_lib/proxy';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; productId: string }> },
) {
  const { id, productId } = await params;
  return proxyDelete(`/api/wishlist/${id}/items/${productId}`, request);
}
