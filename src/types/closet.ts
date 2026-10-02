export interface ClosetItem {
  id: string;
  status: string;
  added_at: string;
  shipped_at: string | null;
  delivered_at: string | null;
  return_by: string | null;
  returned_at: string | null;
  product: {
    id: string;
    name: string;
    brand: string | null;
    retail_price_minor: number;
    rent_price_minor: number | null;
    currency: string;
    thumbnail_url: string | null;
  };
  variant: {
    id: string;
    size: string;
    colour: string | null;
  };
}
