import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccountSubpageShell from "@/components/sections/accounts/AccountSubpageShell";
import LogoutContent from "@/components/sections/accounts/LogoutContent";

export const metadata: Metadata = {
  title: "Log Out - StyleSupply",
  description: "Log out of your StyleSupply account.",
};

export default function LogoutPage() {
  return (
    <>
      <Header />
      <AccountSubpageShell>
        <LogoutContent />
      </AccountSubpageShell>
      <Footer />
    </>
  );
}
