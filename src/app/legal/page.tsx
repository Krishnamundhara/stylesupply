import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LegalPageClient from "@/components/sections/legal/LegalPageClient";

export const metadata: Metadata = {
  title: "Legal - StyleSupply",
  description:
    "Read StyleSupply's Terms & Conditions, Privacy Policy, and Accessibility Statement.",
  alternates: { canonical: "https://stylesupply.io/legal" },
};

export default function LegalPage() {
  return (
    <>
      <Header />
      <main className="w-full bg-white">
        <LegalPageClient />
      </main>
      <Footer />
    </>
  );
}
