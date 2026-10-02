import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sitemap from "@/components/sections/sitemap/Sitemap";

export const metadata: Metadata = {
  title: "Sitemap - StyleSupply",
  description: "Navigate all pages and sections of StyleSupply.",
  alternates: { canonical: "https://stylesupply.io/sitemap" },
};

export default function SitemapPage() {
  return (
    <>
      <Header />
      <div className="mx-auto w-full max-w-360 bg-white">
        <main className="w-full">
          <Sitemap />
        </main>
      </div>
      <Footer />
    </>
  );
}
