import Header from "@/components/layout/Header";
import { FAQPage } from "@/components/sections";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "FAQ — StyleSupply",
  description:
    "Find answers to commonly asked questions about membership, orders, returns, and products at StyleSupply.",
  alternates: { canonical: "https://stylesupply.io/faq" },
};

export default function Page() {
  return (
    <>
      <Header />
      <div className="bg-white">
        <main className="flex flex-col gap-[60px] md:gap-[80px] lg:gap-[80px]">
          <FAQPage />
        </main>
      </div>
      <Footer />
    </>
  );
}
