/**
 * Home page data contracts.
 *
 * These types describe the shape the /home page expects from the backend.
 * The UI components are fully driven by these interfaces — swap the mock
 * service for a real fetch in `src/services/home/getHomeData.ts` and nothing
 * else needs to change.
 */

export interface HomeUser {
  name: string;
}

export interface HomeHeroContent {
  headingPrefix: string; // e.g. "Hi"
  headingSuffix: string; // e.g. ", You're In!"
  headingSecondLine: string; // e.g. "Enter your Private Boutique"
  subtitle: string; // welcome paragraph rendered below the hero image
  ctaLabel: string;
  ctaHref: string;
  backgroundImage: string;
  logoImage: string; // centered emblem on the hero image
  logoImageMobile?: string; // optional mobile-specific emblem asset
}


export interface HomeCollection {
  id: string;
  label: string;
  image: string;
  href: string;
  ctaLabel: string;
}

export interface HomeCollectionsSection {
  title: string;
  /** Mobile-only line breaks; desktop always uses `title` on one line. */
  titleMobileLines?: readonly [string, string];
  collections: HomeCollection[];
}

export interface HomeBrand {
  id: string;
  name: string;
  logo: string;
  href: string;
}

export interface HomeBrandsSection {
  title: string;
  brands: HomeBrand[];
}

export interface HomeProduct {
  id: string;
  /** Real product UUID for wishlist/box mutations. Optional for legacy/mock cards. */
  productId?: string;
  brand: string; // e.g. "RALPH LAUREN"
  name: string; // e.g. "COAT JACKET"
  image: string;
  /** Pre-formatted original price, e.g. "₹20,000". Optional. */
  originalPrice?: string;
  /** Pre-formatted current/rental price, e.g. "₹0 to try". */
  currentPrice: string;
  href: string;
  badge?: string;
  /** Whether this product is in the user's "All Saved" wishlist on initial render. */
  isSaved?: boolean;
}

export interface HomeProductSection {
  title: string;
  subtitle?: string;
  products: HomeProduct[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

export interface HomeMemberLook {
  id: string;
  image: string;
  title: string; // e.g. "Weekend Brunch Edit"
  caption: string; // e.g. "Nisha from Bandra added this to her closet"
  rating: string; // e.g. "4.8"
  size: string; // e.g. "M"
  href: string;
}

export interface HomeMembersRentingSection {
  title: string;
  subtitle?: string;
  looks: HomeMemberLook[];
}




export interface HomeCollectionBannerSlide {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  imageMobile?: string;
  imageAlt?: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface HomeCollectionBanner {
  slides: HomeCollectionBannerSlide[];
}

export interface HomeEditorialBrand {
  id: string;
  logo: string;
  bgColor: string;
  href?: string;
  products: HomeProduct[];
}

export interface HomeEditorialsSection {
  title: string;
  brands: HomeEditorialBrand[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

export interface HomePageData {
  user: HomeUser;
  hero: HomeHeroContent;
  collectionsSection: HomeCollectionsSection;
  diveRightIn: HomeProductSection;
  curateYourBox: HomeProductSection;
  collectionBanner: HomeCollectionBanner;
  curatedDesigners: HomeEditorialsSection;
}
