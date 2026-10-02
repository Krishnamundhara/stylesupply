import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccountSubpageShell from "@/components/sections/accounts/AccountSubpageShell";
import MyReviewsContent from "@/components/sections/accounts/MyReviewsContent";

export const metadata: Metadata = {
  title: "My Reviews - StyleSupply",
  description: "Your product reviews and ratings on StyleSupply.",
};

export default function ProfileReviewsPage() {
  return (
    <>
      <Header />
      <AccountSubpageShell title="My Reviews" subtitle="Items you tried, loved and kept">
        <MyReviewsContent />
      </AccountSubpageShell>
      <Footer />
    </>
  );
}
