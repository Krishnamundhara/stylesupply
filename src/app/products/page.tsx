import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductLandingContent from "@/components/sections/products/ProductLandingContent";

export const metadata: Metadata = {
  title: "All Products — StyleSupply",
  description:
    "Browse the full Style Supply wardrobe: designer rental pieces, curated categories, and build your box.",
  alternates: { canonical: "https://stylesupply.io/products" },
};

interface Props {
  searchParams: Promise<{
    category_type?: string;
    subcategory?: string;
    sub_subcategory?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  return (
    <>
      <Header />
      <div className="w-full bg-white">
        <main className="flex flex-col">
          <ProductLandingContent
            initialCategoryType={sp.category_type}
            initialSubcategory={sp.subcategory}
            initialSubSubcategory={sp.sub_subcategory}
            initialSort={sp.sort}
            initialPage={sp.page ? Number(sp.page) : 1}
          />
        </main>
      </div>
      <Footer />
    </>
  );
}
