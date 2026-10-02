import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccountSubpageShell from "@/components/sections/accounts/AccountSubpageShell";
import ManageMembershipContent from "@/components/sections/accounts/ManageMembershipContent";

export const metadata: Metadata = {
  title: "Manage Membership - StyleSupply",
  description: "Pause or cancel your StyleSupply membership.",
};

interface PageProps {
  searchParams?: Promise<{ preview?: string }>;
}

export default async function ManageMembershipPage({ searchParams }: PageProps) {
  const sp = searchParams ? await searchParams : {};
  const devActive = process.env.NODE_ENV === "development" && sp.preview === "active";

  return (
    <>
      <Header />
      <AccountSubpageShell title="Account Settings" subtitle="Need support? We're here.">
        <ManageMembershipContent devActive={devActive} />
      </AccountSubpageShell>
      <Footer />
    </>
  );
}
