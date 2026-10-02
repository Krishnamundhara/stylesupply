import type { ProductCard } from './product';

export interface WishlistSummary {
  id: string;
  name: string;
  item_count: number;
  preview_images: string[];
  created_at: string;
}

export interface WishlistDetail {
  wishlist: {
    id: string;
    name: string;
    user_id: string;
    created_at: string;
  };
  products: ProductCard[];
}
