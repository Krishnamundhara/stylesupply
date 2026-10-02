import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccountSubpageShell from "@/components/sections/accounts/AccountSubpageShell";
import HelpCentreContent from "@/components/sections/accounts/HelpCentreContent";


export const metadata: Metadata = {
  title: "Help Centre - StyleSupply",
  description: "Find answers to common questions about StyleSupply.",
};

export default async function HelpCentrePage() {
  return (
    <>
      <Header />
      <AccountSubpageShell title="Help Center" subtitle="Need support? We're here.">
        <HelpCentreContent />
      </AccountSubpageShell>
      <Footer />
    </>
  );
}
