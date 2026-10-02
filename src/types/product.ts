export interface ProductBrand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
}

export interface ProductImage {
  id: string;
  public_url: string;
  alt: string | null;
  sort_order: number;
  colour_id?: string | null;
  custom_colour?: string | null;
}

export interface ProductColour {
  id: string;
  name: string;
  slug: string;
  hex: string;
}

export interface ProductCard {
  product_id: string;
  card_id: string;
  name: string;
  brand: ProductBrand | null;
  colour: ProductColour | null;
  custom_colour: string | null;
  retail_price_minor: number;
  rent_price_minor: number | null;
  currency: string;
  thumbnail_url: string | null;
  available_sizes: string[];
  is_saved: boolean;
}

export interface ColourGroup {
  id: string | null;
  name: string;
  slug: string;
  hex: string | null;
  custom_colour: string | null;
  images: ProductImage[];
  available_sizes: string[];
  unavailable_sizes: string[];
  size_to_variant_id: Record<string, string>;
}

export interface ProductLook {
  id: string;
  name: string;
  slug: string;
  is_primary: boolean;
  collection: { id: string; name: string; slug: string } | null;
}

export interface ProductDetail {
  id: string;
  name: string;
  sku: string | null;
  description: string | null;
  fabric_details: string | null;
  brand: ProductBrand | null;
  category: { id: string; name: string; slug: string } | null;
  subcategory: { id: string; name: string; slug: string } | null;
  sub_subcategory: { id: string; name: string; slug: string } | null;
  material: { id: string; name: string; slug: string } | null;
  retail_price_minor: number;
  rent_price_minor: number | null;
  currency: string;
  colours: ColourGroup[];
  shared_images: ProductImage[];
  looks: ProductLook[];
  is_saved: boolean;
}

export interface BrowseResponse {
  cards: ProductCard[];
  total: number;
}

export interface BrowseParams {
  q?: string;
  category_type?: string;
  subcategory?: string;
  sub_subcategory?: string;
  brand?: string;
  collection?: string;
  look?: string;
  colour?: string;
  material?: string;
  size?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}
