import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccountSubpageShell from "@/components/sections/accounts/AccountSubpageShell";
import ChangePasswordContent from "@/components/sections/accounts/ChangePasswordContent";

export const metadata: Metadata = {
  title: "Change Password - StyleSupply",
  description: "Update your account password.",
};

export default function ChangePasswordPage() {
  return (
    <>
      <Header />
      <AccountSubpageShell>
        <ChangePasswordContent />
      </AccountSubpageShell>
      <Footer />
    </>
  );
}
