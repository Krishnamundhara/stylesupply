import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/faq$", "/about$", "/howitworks$"],
        disallow: ["/faq/", "/about/", "/howitworks/", "/join", "/products", "/brands", "/collections", "/blogs", "/product", "/accounts", "/cart", "/closet", "/wishlist", "/home", "/login", "/signup", "/maq", "/coming-soon", "/request-access", "/privacy-policy", "/accessibility", "/your-privacy-choices"],
      },
    ],
    sitemap: "https://stylesupply.io/sitemap.xml",
  };
}
