import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WriteReviewContent from "@/components/sections/accounts/WriteReviewContent";

export const metadata: Metadata = {
  title: "Write a Review - StyleSupply",
  description: "Rate and review items from your wardrobe.",
};

export default async function WriteReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string }>;
}) {
  const { productId } = await searchParams;

  return (
    <>
      <Header />
      <main className="w-full max-w-[1440px] mx-auto">
        <WriteReviewContent productId={productId} />
      </main>
      <Footer />
    </>
  );
}
