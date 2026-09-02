import { createFileRoute } from "@tanstack/react-router";
import * as portfolioFr from "@/content/portfolio";
import { uiStringsFr } from "@/content/ui-strings";
import { PortfolioPage } from "@/components/portfolio-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Joris Grouillet — Product Architect" },
      {
        name: "description",
        content:
          "Product clarity. Technical fluency. Portfolio freelance de Joris Grouillet : architecture produit & technique, santé, IA, interopérabilité, et side-business nocodext.studio.",
      },
      { property: "og:title", content: "Joris Grouillet — Product Architect" },
      {
        property: "og:description",
        content:
          "Product clarity. Technical fluency. Cas clients en santé, IA, interopérabilité et SaaS métier, plus quatre side-business en production.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://askalia.net/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://askalia.net/" },
      { rel: "alternate", hrefLang: "fr", href: "https://askalia.net/" },
      { rel: "alternate", hrefLang: "en", href: "https://askalia.net/en" },
      { rel: "alternate", hrefLang: "x-default", href: "https://askalia.net/" },
    ],
  }),
  component: () => <PortfolioPage content={portfolioFr} strings={uiStringsFr} />,
});
