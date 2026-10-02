import type { HomePageData, HomeProduct, HomeEditorialBrand } from "@/types/home";


const makeProduct = (i: number, seed: string): HomeProduct => ({
  id: `${seed}-${i}`,
  brand: "",
  name: "",
  image: "",
  originalPrice: "",
  currentPrice: "",
  href: `/products/${seed}-${i}`,
});

const productRow = (seed: string, count = 6): HomeProduct[] =>
  Array.from({ length: count }, (_, i) => makeProduct(i + 1, seed));

export const homeData: HomePageData = {
  user: { name: "there" },

  hero: {
    headingPrefix: "Hi",
    headingSuffix: ", You're In!",
    headingSecondLine: "Enter your Private Boutique",
    subtitle:
      "Your first month is on us. You're a part of our Founding Circle: the very first members of Style Supply.",
    ctaLabel: "Build Your First Box",
    ctaHref: "/products",
    // Temporary local fallback to avoid remote asset failures in production.
    backgroundImage: "/images/home/hero-desktop.png",
    logoImage: "/logo/cream.svg",
    logoImageMobile: "/logo/cream.svg",
  },

  collectionsSection: {
    title: "What are you looking for?",
    titleMobileLines: ["What are you", "looking for?"],
    collections: [
      {
        id: "clothing",
        label: "Clothing",
        image: "/images/home/clothing.webp",
        href: "/products?category=Clothing",
        ctaLabel: "Discover",
      },
      {
        id: "accessories",
        label: "Accessories",
        image: "/images/home/accesories.webp",
        href: "/products?category=Accessories",
        ctaLabel: "Discover",
      },
    ],
  },

  diveRightIn: {
    title: "Dive Right In",
    products: Array.from({ length: 10 }, (_, i) => ({
      ...makeProduct(i + 1, "dive"),
      image: "/images/home/dive-right-in-figma.png",
    })),
    viewAllHref: "/products",
    viewAllLabel: "Browse All",
  },

  curateYourBox: {
    title: "Build Your Box",
    subtitle: "Curate styles to create a look or try the same style in different sizes.",
    products: Array.from({ length: 4 }, (_, i) => ({
      ...makeProduct(i + 1, "curate"),
      image: "/images/home/build-your-box-figma.png",
    })),
    viewAllHref: "/box/my-box",
    viewAllLabel: "View Box",
  },

  collectionBanner: {
    slides: [
      {
        eyebrow: "The Style Edit",
        title: "Everyday Icons",
        subtitle: "The ease of good taste.",
        image: "/images/collection/collection_1_desktop.webp",
        imageMobile: "/images/home/carousel_mobile_1.webp",
        imageAlt: "Everyday Icons editorial banner",
        ctaLabel: "View Collection",
        ctaHref: "/collections/everyday-icons",
      },
      {
        eyebrow: "The Style Edit",
        title: "Daytime Soirée",
        subtitle: "For sunlit jest and golden-hour arrivals.",
        image: "/images/collection/collection_2_desktop.webp",
        imageMobile: "/images/home/carousel_mobile_2.webp",
        imageAlt: "Daytime Soirée editorial banner",
        ctaLabel: "View Collection",
        ctaHref: "/collections/daytime-soiree",
      },
      {
        eyebrow: "The Style Edit",
        title: "After Hours",
        subtitle: "Where the night begins.",
        image: "/images/collection/collection_3_desktop.webp",
        imageMobile: "/images/home/carousel_mobile_3.webp",
        imageAlt: "After Hours editorial banner",
        ctaLabel: "View Collection",
        ctaHref: "/collections/after-hours",
      },
    ],
  },

  curatedDesigners: {
    title: "Curated Designers",
    brands: [
      { id: "saphed", logo: "/images/home/brand1.webp", bgColor: "#ABAA8B", href: "/brands/saphed", products: productRow("designers-1", 6) },
      { id: "sirooh", logo: "/images/home/brand3.webp", bgColor: "#F2F0EB", href: "/brands/sirooh", products: productRow("designers-3", 6) },
      { id: "antithesis-india", logo: "/images/home/brand2.webp", bgColor: "#070705", href: "/brands/antithesis", products: productRow("designers-2", 6) },
      { id: "two-extra-lives", logo: "/images/home/brand4.webp", bgColor: "#FFFFFF", href: "/brands/two-extra-lives", products: productRow("designers-4", 6) },
      { id: "drama-club", logo: "/images/home/brand5.webp", bgColor: "#7A021D", href: "/brands/drama-club", products: productRow("designers-5", 6) },
      { id: "valliyan", logo: "/images/home/brand6.webp", bgColor: "#F2F0EB", href: "/brands/valliyan", products: productRow("designers-6", 6) },
    ] satisfies HomeEditorialBrand[],
    viewAllHref: "/brands",
    viewAllLabel: "Explore Brands",
  },
};
