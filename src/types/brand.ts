export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  hero_url: string | null;
  description: string | null;
  tile_variant: string;
  sort_order: number;
}
