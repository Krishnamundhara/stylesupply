export type BoxStatus = 'draft' | 'confirmed' | 'paid' | 'shipped' | 'delivered' | 'completed';

export interface Box {
  id: string;
  user_id: string;
  status: BoxStatus;
  created_at: string;
  confirmed_at?: string;
  paid_at?: string;
}

export interface BoxItemProduct {
  id: string;
  name: string;
  brand: string;
  retail_price_minor: number;
  currency: string;
  thumbnail_url: string | null;
}

export interface BoxItemVariant {
  id: string;
  size: string;
}

export interface BoxItem {
  id: string;
  box_id: string;
  product_id: string;
  variant_id: string;
  decision?: 'keep' | 'return';
  product?: BoxItemProduct;
  variant?: BoxItemVariant;
}

export interface BoxWithItems extends Box {
  items: BoxItem[];
}
