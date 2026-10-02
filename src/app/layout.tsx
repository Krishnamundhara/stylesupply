import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { headers } from "next/headers";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { AuthProvider } from "@/context/AuthContext";
import { BoxProvider } from "@/context/BoxContext";
import { MembershipProvider } from "@/context/MembershipContext";
import ToasterProvider from "@/components/providers/ToasterProvider";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const isVercelPreview = host.endsWith(".vercel.app");

  return {
    metadataBase: new URL("https://stylesupply.io"),
    title: {
      default: "Style Supply — Your Private Boutique, Delivered",
      template: "%s | Style Supply",
    },
    description:
      "Membership by invite only. Try premium fashion in the comfort of your home with a subscription. Choose from curated designer labels to build a custom box. Premium fashion delivered in 24 hours.",
    alternates: {
      canonical: "/",
    },
    robots: isVercelPreview
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title: "Style Supply — Your Private Boutique, Delivered",
      description:
        "Membership by invite only. Try premium fashion in the comfort of your home with a subscription. Choose from curated designer labels to build a custom box. Premium fashion delivered in 24 hours.",
      url: "https://stylesupply.io",
      siteName: "Style Supply",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: "/images/og-default.jpg",
          width: 1200,
          height: 630,
          alt: "Style Supply — Your Private Boutique, Delivered",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Style Supply — Your Private Boutique, Delivered",
      description:
        "Membership by invite only. Try premium fashion in the comfort of your home with a subscription.",
      images: ["/images/og-default.jpg"],
    },
    icons: {
      icon: [{ url: "/icon/favicon.svg", type: "image/svg+xml" }],
      shortcut: "/icon/favicon.svg",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <body style={{ position: "relative" }}>
        <AuthProvider>
          <MembershipProvider>
            <BoxProvider>
              <SmoothScrollProvider>
              {children}
              <ToasterProvider />
              </SmoothScrollProvider>
            </BoxProvider>
          </MembershipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
