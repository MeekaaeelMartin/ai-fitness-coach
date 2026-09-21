import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/assessment", "/signup", "/login", "/privacy", "/terms", "/llms.txt"],
        disallow: [
          "/dashboard",
          "/profile",
          "/admin",
          "/api/",
          "/subscribe/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
