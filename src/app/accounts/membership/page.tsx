import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccountSubpageShell from "@/components/sections/accounts/AccountSubpageShell";
import MembershipContent from "@/components/sections/accounts/MembershipContent";

export const metadata: Metadata = {
  title: "My Membership - StyleSupply",
  description: "Manage your StyleSupply membership plan and subscription.",
};

export default function MembershipPage() {
  return (
    <>
      <Header />
      <AccountSubpageShell>
        <MembershipContent />
      </AccountSubpageShell>
      <Footer />
    </>
  );
}
