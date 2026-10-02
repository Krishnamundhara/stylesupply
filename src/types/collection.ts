import type { ProductCard } from './product';

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  hero_url: string | null;
  tile_variant: string;
  sort_order: number;
}

export interface CollectionWithProducts extends Collection {
  products: ProductCard[];
}
