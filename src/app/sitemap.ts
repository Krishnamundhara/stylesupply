import { MetadataRoute } from "next";

const BASE = "https://stylesupply.io";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}`,             lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/faq`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/about`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/howitworks`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
