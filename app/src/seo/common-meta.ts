export const getOrganizationJsonLd = () => {
  return {
    innerHTML: `
    {
      "@context" : "http://schema.org",
      "@type" : "Organization",
      "logo": "https://images.my83.com.tw/front/seo/logo-jsonld-organization.png",
      "url" : "https://my83.com.tw",
      "contactPoint": [{
          "@type": "ContactPoint",
          "email" : "service@my83.com.tw",
          "url" : "https://my83.com.tw",
          "contactType": "customer service"
      }],
      "sameAs" : [
          "https://facebook.com/my83.com.tw/"
      ]
    }
    `,
    type: 'application/ld+json',
  }
}
