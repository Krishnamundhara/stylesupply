import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccountSubpageShell from "@/components/sections/accounts/AccountSubpageShell";
import SettingsContent from "@/components/sections/accounts/SettingsContent";
import { getServerUser } from "@/services/serverProfile";

export const metadata: Metadata = {
  title: "Settings - StyleSupply",
  description: "Account and notification settings for StyleSupply.",
};

export default async function ProfileSettingsPage() {
  const user = await getServerUser();

  return (
    <>
      <Header />
      <AccountSubpageShell userName={user?.name?.split(" ")[0]}>
        <SettingsContent />
      </AccountSubpageShell>
      <Footer />
    </>
  );
}
