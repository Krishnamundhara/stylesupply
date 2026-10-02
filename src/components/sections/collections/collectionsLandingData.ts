import type { CollectionProduct } from "./CollectionShowcase";

const HERO_IMAGE_1_D = "/images/collection/collection_1_desktop.webp";
const HERO_IMAGE_1_M = "/images/collection/collection_1_mobile.webp";
const HERO_IMAGE_2_D = "/images/collection/collection_2_desktop.webp";
const HERO_IMAGE_2_M = "/images/collection/collection_2_mobile.webp";
const HERO_IMAGE_3_D = "/images/collection/collection_3_desktop.webp";
const HERO_IMAGE_3_M = "/images/collection/collection_3_mobile.webp";

const IMG_PRODUCT_1 = "/images/collection/Prod_image.png";
const IMG_PRODUCT_2 = "/images/collection/Prod_image.png";
const IMG_PRODUCT_3 = "/images/collection/Prod_image.png";
const IMG_PRODUCT_4 = "/images/collection/Prod_image.png";
const IMG_PRODUCT_5 = "/images/collection/Prod_image.png";
const IMG_PRODUCT_6 = "/images/collection/Prod_image.png";
const IMG_PRODUCT_7 = "/images/collection/Prod_image.png";

export const COLLECTIONS_LANDING_ASSETS = {
  heroImage: HERO_IMAGE_1_D,
} as const;

export type TempCollection = {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  hero_url: string;
  hero_url_mobile?: string;
  products: CollectionProduct[];
};

const TEMP_PRODUCTS_ONE: CollectionProduct[] = [
  { id: "t1", brand: "Ralph Lauren", name: "Coat Jacket", retailPrice: "₹20,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_1 },
  { id: "t2", brand: "Ralph Lauren", name: "Resort Gown", retailPrice: "₹20,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_2 },
  { id: "t3", brand: "Ralph Lauren", name: "Satin Blazer", retailPrice: "₹20,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_3 },
  { id: "t4", brand: "Ralph Lauren", name: "Mini Dress", retailPrice: "₹20,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_4 },
  { id: "t5", brand: "Ralph Lauren", name: "Ivory Set", retailPrice: "₹20,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_5 },
  { id: "t1b", brand: "Ralph Lauren", name: "Linen Trousers", retailPrice: "₹18,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_6 },
  { id: "t2b", brand: "Ralph Lauren", name: "Wrap Skirt", retailPrice: "₹15,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_7 },
  { id: "t3b", brand: "Ralph Lauren", name: "Silk Blouse", retailPrice: "₹17,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_1 },
  { id: "t4b", brand: "Ralph Lauren", name: "Tailored Shorts", retailPrice: "₹12,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_2 },
  { id: "t5b", brand: "Ralph Lauren", name: "Polo Dress", retailPrice: "₹22,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_3 },
];

const TEMP_PRODUCTS_TWO: CollectionProduct[] = [
  { id: "t6", brand: "Gucci", name: "Tailored Suit", retailPrice: "₹35,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_5 },
  { id: "t7", brand: "Gucci", name: "Evening Jacket", retailPrice: "₹28,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_6 },
  { id: "t8", brand: "Gucci", name: "Black Co-ord", retailPrice: "₹24,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_7 },
  { id: "t9", brand: "Gucci", name: "Classic Set", retailPrice: "₹30,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_1 },
  { id: "t10", brand: "Gucci", name: "Sharp Layers", retailPrice: "₹26,500", rentPrice: "₹0 to try", image: IMG_PRODUCT_2 },
  { id: "t6b", brand: "Gucci", name: "Flared Pants", retailPrice: "₹32,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_3 },
  { id: "t7b", brand: "Gucci", name: "Ruched Gown", retailPrice: "₹40,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_4 },
  { id: "t8b", brand: "Gucci", name: "Printed Blouse", retailPrice: "₹22,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_5 },
  { id: "t9b", brand: "Gucci", name: "Midi Skirt", retailPrice: "₹27,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_6 },
  { id: "t10b", brand: "Gucci", name: "Silk Wrap Dress", retailPrice: "₹38,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_7 },
];

const TEMP_PRODUCTS_THREE: CollectionProduct[] = [
  { id: "t11", brand: "Zimmermann", name: "Floral Maxi", retailPrice: "₹25,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_3 },
  { id: "t12", brand: "Zimmermann", name: "Linen Dress", retailPrice: "₹20,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_4 },
  { id: "t13", brand: "Zimmermann", name: "Resort Co-ord", retailPrice: "₹22,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_5 },
  { id: "t14", brand: "Zimmermann", name: "Wrap Blouse", retailPrice: "₹16,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_6 },
  { id: "t15", brand: "Zimmermann", name: "Mini Skirt", retailPrice: "₹14,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_7 },
  { id: "t11b", brand: "Zimmermann", name: "Broderie Dress", retailPrice: "₹28,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_1 },
  { id: "t12b", brand: "Zimmermann", name: "Smocked Top", retailPrice: "₹18,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_2 },
  { id: "t13b", brand: "Zimmermann", name: "Prairie Midi", retailPrice: "₹24,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_3 },
  { id: "t14b", brand: "Zimmermann", name: "Ruffled Blouse", retailPrice: "₹17,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_4 },
  { id: "t15b", brand: "Zimmermann", name: "Tiered Maxi", retailPrice: "₹30,000", rentPrice: "₹0 to try", image: IMG_PRODUCT_5 },
];

export const TEMP_COLLECTIONS: TempCollection[] = [
  {
    id: "temp-1",
    name: "Everyday Icons",
    slug: "everyday-icons",
    subtitle: "Elevated pieces designed for how you show up, every day.",
    hero_url: HERO_IMAGE_1_D,
    hero_url_mobile: HERO_IMAGE_1_M,
    products: TEMP_PRODUCTS_ONE,
  },
  {
    id: "temp-2",
    name: "Daytime Soirée",
    slug: "daytime-soiree",
    subtitle: "For when the day calls for more.",
    hero_url: HERO_IMAGE_2_D,
    hero_url_mobile: HERO_IMAGE_2_M,
    products: TEMP_PRODUCTS_TWO,
  },
  {
    id: "temp-3",
    name: "After hours",
    slug: "after-hours",
    subtitle: "For evenings that call for something more.",
    hero_url: HERO_IMAGE_3_D,
    hero_url_mobile: HERO_IMAGE_3_M,
    products: TEMP_PRODUCTS_THREE,
  },
];

// kept for any other consumers
export const COLLECTIONS_ROW_PRODUCTS: CollectionProduct[] = TEMP_PRODUCTS_ONE;
export const COLLECTIONS_MIXED_PRODUCTS: CollectionProduct[] = TEMP_PRODUCTS_TWO;
export const COLLECTIONS_EDITORIAL_PRODUCTS = TEMP_PRODUCTS_ONE.map((p) => ({
  id: p.id, brand: p.brand, name: p.name, image: p.image,
}));
