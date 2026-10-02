import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccountSubpageShell from "@/components/sections/accounts/AccountSubpageShell";
import MyWardrobeContent from "@/components/sections/accounts/MyWardrobeContent";

export const metadata: Metadata = {
  title: "My Profile - StyleSupply",
  description: "Manage your StyleSupply profile and personal information.",
};

export default function MyProfilePage() {
  return (
    <>
      <Header />
      <AccountSubpageShell title="My Wardrobe" subtitle="Items you tried, loved and kept">
        <MyWardrobeContent />
      </AccountSubpageShell>
      <Footer />
    </>
  );
}
