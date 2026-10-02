import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BrandsPageGrid, BrandsMoreToDiscover } from "@/components/sections";
import type { Brand } from "@/types/brand";
import { TEMP_BRANDS } from "@/data/brands";

export const metadata: Metadata = {
  title: "Explore Brands - StyleSupply",
  description:
    "Explore sought-after designer brands on StyleSupply and discover their full collections.",
  alternates: { canonical: "https://stylesupply.io/brands" },
};

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";


async function getBrands(): Promise<Brand[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/brands`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return TEMP_BRANDS;
    const data = await res.json();
    const brands = data.brands ?? data ?? [];
    return brands.length > 0 ? brands : TEMP_BRANDS;
  } catch {
    return TEMP_BRANDS;
  }
}

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <>
      <Header />
      <main className="w-full bg-white flex flex-col">
        <BrandsPageGrid brands={brands} />
        <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[7.639vw]" aria-hidden />
        <BrandsMoreToDiscover />
        <div className="h-[27.778vw] w-full shrink-0 md:h-[13.021vw] lg:h-[8.333vw]" aria-hidden />
      </main>
      <Footer />
    </>
  );
}
