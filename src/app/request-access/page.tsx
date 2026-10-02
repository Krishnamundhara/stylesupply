import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RequestAccessClient from "@/components/sections/request-access/RequestAccessClient";

export const metadata = {
  title: "Request Access – StyleSupply",
  description: "Request early access to StyleSupply — your curated fashion rental platform.",
};

export default function Page() {
  return (
    <>
      <Header />
      <div className="w-full bg-white font-[var(--font-manrope)] pb-[60px] md:mx-auto md:max-w-360 md:pb-[80px]">
        <main>
          <RequestAccessClient />
        </main>
      </div>
      <Footer />
    </>
  );
}
