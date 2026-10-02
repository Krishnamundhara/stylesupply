import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccountSubpageShell from "@/components/sections/accounts/AccountSubpageShell";
import MyProfileContent from "@/components/sections/accounts/MyProfileContent";

export const metadata: Metadata = {
  title: "My Profile - StyleSupply",
  description: "View and edit your profile details.",
};

export default function MyProfilePage() {
  return (
    <>
      <Header />
      <AccountSubpageShell>
        <MyProfileContent />
      </AccountSubpageShell>
      <Footer />
    </>
  );
}
