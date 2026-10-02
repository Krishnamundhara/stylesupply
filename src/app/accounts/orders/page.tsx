import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccountSubpageShell from "@/components/sections/accounts/AccountSubpageShell";
import PastBoxesContent from "@/components/sections/accounts/PastBoxesContent";

export const metadata: Metadata = {
  title: "Past Boxes - StyleSupply",
  description: "View your past StyleSupply boxes.",
};

export default function PastBoxesPage() {
  return (
    <>
      <Header />
      <AccountSubpageShell title="Past Boxes" subtitle="Everything you tried at home">
        <PastBoxesContent />
      </AccountSubpageShell>
      <Footer />
    </>
  );
}
