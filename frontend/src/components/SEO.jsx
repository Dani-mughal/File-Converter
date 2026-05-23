import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ config }) => {
  const { title, description, keywords, url, image, h1, faq } = config;

  // 1. WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ConverterHub",
    "url": "https://converterhub.tech",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://converterhub.tech/?s={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // 2. Organization Schema
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ConverterHub",
    "url": "https://converterhub.tech",
    "logo": "https://converterhub.tech/favicon.svg",
    "sameAs": [
      "https://twitter.com/converterhub",
      "https://facebook.com/converterhub"
    ]
  };

  // 3. SoftwareApplication Schema (Dynamic based on tool)
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": h1 || title,
    "operatingSystem": "Any",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1250"
    }
  };

  // 4. FAQ Schema
  const faqSchema = faq ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  } : null;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ConverterHub" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(orgSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(softwareSchema)}
      </script>
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
