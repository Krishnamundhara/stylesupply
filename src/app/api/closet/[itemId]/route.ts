import { type NextRequest } from 'next/server';
import { proxyDelete } from '../../_lib/proxy';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const { itemId } = await params;
  return proxyDelete(`/api/closet/${itemId}`, request);
}
