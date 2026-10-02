import Header from "@/components/layout/Header";
import ContactContent from "@/components/sections/contact/ContactContent";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Contact Us — StyleSupply",
  description: "Get in touch with the StyleSupply team. We're here to help with any questions about membership, orders, or returns.",
  alternates: { canonical: "https://stylesupply.io/contact" },
};

export default function Page() {
  return (
    <>
      <Header />
      <div className="bg-white">
        <main className="flex flex-col">
          <ContactContent />
        </main>
      </div>
      <div className="h-[27.778vw] md:h-[13.021vw] lg:h-[8.333vw]" />
      <Footer />
    </>
  );
}
