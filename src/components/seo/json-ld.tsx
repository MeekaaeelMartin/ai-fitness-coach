import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo/site";
import { FAQ_ITEMS } from "@/lib/seo/faq-data";

function JsonLdScript({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function HomeJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    areaServed: {
      "@type": "Country",
      name: "South Africa",
    },
    sameAs: [],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en-ZA",
  };

  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "100",
      priceCurrency: "ZAR",
      description: "Monthly subscription after free trial",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/#pricing`,
    },
    featureList: [
      "Personalised workout plans",
      "Custom meal plans in Rands",
      "Fitness assessment",
      "Progress tracking",
      "South Africa focused",
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.content,
      },
    })),
  };

  return (
    <>
      <JsonLdScript data={organization} />
      <JsonLdScript data={website} />
      <JsonLdScript data={software} />
      <JsonLdScript data={faq} />
    </>
  );
}
