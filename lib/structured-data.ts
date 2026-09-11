import {
  absoluteUrl,
  defaultDescription,
  faqId,
  faqs,
  legalIdentity,
  organizationId,
  people,
  services,
  siteName,
  siteUrl,
  webpageId,
  websiteId,
} from "./site";

type JsonLd = Record<string, unknown>;

function organizationNode(): JsonLd {
  const founders = people.map((person) => ({ "@id": `${siteUrl}/#${person.initials.toLowerCase()}` }));
  const node: JsonLd = {
    "@type": ["ProfessionalService", "Organization"],
    "@id": organizationId,
    name: siteName,
    legalName: legalIdentity.name,
    url: siteUrl,
    logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") },
    image: absoluteUrl("/opengraph-image"),
    description: defaultDescription,
    vatID: legalIdentity.vat,
    areaServed: { "@type": "Country", name: "Italia" },
    availableLanguage: "it",
    inLanguage: "it-IT",
    knowsAbout: [
      "automazione dei processi aziendali",
      "lettura di documenti",
      "integrazione tra gestionali",
      "preventivi e ordini",
      "giri dei tecnici",
      "software su misura per PMI",
    ],
    serviceType: services.map((service) => service.name),
    founder: founders,
    employee: founders,
    sameAs: people.map((person) => person.linkedin),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Cosa facciamo",
      itemListElement: services.map((service, index) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          "@id": `${siteUrl}/#servizio-${index + 1}`,
          name: service.name,
          description: service.description,
          provider: { "@id": organizationId },
          areaServed: { "@type": "Country", name: "Italia" },
        },
      })),
    },
    makesOffer: {
      "@type": "Offer",
      name: "Valutazione gratuita",
      description:
        "Valutazione di un’attività ripetuta e ricontatto per fissare una consulenza. Gratuita, senza obblighi di acquisto.",
      price: "0",
      priceCurrency: "EUR",
      url: absoluteUrl("/#contatti"),
    },
  };

  if (legalIdentity.email) {
    node.email = legalIdentity.email;
    node.contactPoint = {
      "@type": "ContactPoint",
      contactType: "sales",
      email: legalIdentity.email,
      availableLanguage: ["Italian"],
      url: absoluteUrl("/#contatti"),
    };
  }

  if (legalIdentity.address) {
    node.address = {
      "@type": "PostalAddress",
      streetAddress: legalIdentity.address,
      addressCountry: "IT",
    };
  } else {
    node.address = { "@type": "PostalAddress", addressCountry: "IT" };
  }

  return node;
}

function personNodes(): JsonLd[] {
  return people.map((person) => ({
    "@type": "Person",
    "@id": `${siteUrl}/#${person.initials.toLowerCase()}`,
    name: person.name,
    jobTitle: person.jobTitle,
    image: absoluteUrl(person.photo),
    url: person.linkedin,
    sameAs: person.linkedin,
    worksFor: { "@id": organizationId },
  }));
}

export function siteGraph(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteName,
        url: siteUrl,
        inLanguage: "it-IT",
        description: defaultDescription,
        publisher: { "@id": organizationId },
      },
      ...personNodes(),
    ],
  };
}

export function homeGraph(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: siteUrl,
        name: "Meno lavoro rifatto a mano nella tua azienda",
        description: defaultDescription,
        inLanguage: "it-IT",
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        primaryImageOfPage: absoluteUrl("/opengraph-image"),
        mainEntity: { "@id": faqId },
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        url: absoluteUrl("/#domande"),
        inLanguage: "it-IT",
        isPartOf: { "@id": webpageId },
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

export function legalPageGraph(title: string, description: string, path: string): JsonLd {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#pagina`,
    url,
    name: title,
    description,
    inLanguage: "it-IT",
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: title, item: url },
      ],
    },
  };
}
