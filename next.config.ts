import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    // Temporary production-safe fallback:
    // bypass Next.js image optimization so remote design URLs still render on Vercel.
    // Remove this after migrating all Figma asset URLs to stable CDN/public assets.
    unoptimized: true,
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.figma.com",
        pathname: "/api/mcp/asset/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/**",
      },
    ],
  },
  async headers() {
    const isProduction = process.env.VERCEL_ENV === "production";

    const baseHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];

    return [
      {
        source: "/:path*",
        headers: isProduction
          ? baseHeaders
          : [...baseHeaders, { key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  async rewrites() {
    // With shared cookie domain (.stylesupply.io), browser sends cookies to api.stylesupply.io automatically
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "https://api.stylesupply.io"}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/profile", destination: "/accounts", permanent: true },
      { source: "/profile/:path*", destination: "/accounts/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
