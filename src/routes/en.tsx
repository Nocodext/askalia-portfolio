import { createFileRoute } from "@tanstack/react-router";
import * as portfolioEn from "@/content/portfolio.en";
import { uiStringsEn } from "@/content/ui-strings";
import { PortfolioPage } from "@/components/portfolio-page";

export const Route = createFileRoute("/en")({
  head: () => ({
    meta: [
      { title: "Joris Grouillet — Product Architect" },
      {
        name: "description",
        content:
          "Product clarity. Technical fluency. Freelance portfolio of Joris Grouillet: product & technical architecture, healthcare, AI, interoperability, and side venture nocodext.studio.",
      },
      { property: "og:title", content: "Joris Grouillet — Product Architect" },
      {
        property: "og:description",
        content:
          "Product clarity. Technical fluency. Client case studies in healthcare, AI, interoperability and business SaaS, plus four side ventures in production.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://askalia.net/en" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://askalia.net/en" },
      { rel: "alternate", hrefLang: "fr", href: "https://askalia.net/" },
      { rel: "alternate", hrefLang: "en", href: "https://askalia.net/en" },
      { rel: "alternate", hrefLang: "x-default", href: "https://askalia.net/" },
    ],
  }),
  component: () => <PortfolioPage content={portfolioEn} strings={uiStringsEn} />,
});
