import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
  schema?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'FNP Florist & Bakery in Sector 76 Noida | Cakes, Flowers & Gifts',
  description = 'Freshly prepared cakes, exotic flower bouquets, indoor plants and luxury gift hampers in Sector 76, Noida. Doorstep delivery and easy WhatsApp ordering.',
  canonical,
  image = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop',
  type = 'website',
  schema,
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper to update or create meta tags
    const updateMeta = (nameAttr: string, key: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('name', 'description', description);
    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:image', image);
    updateMeta('property', 'og:type', type);
    updateMeta('name', 'twitter:title', title);
    updateMeta('name', 'twitter:description', description);
    updateMeta('name', 'twitter:image', image);

    // Keep each client-side route canonical instead of inheriting index.html's URL.
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical || `${window.location.origin}${window.location.pathname}`);

    // Dynamic JSON-LD script if provided
    let scriptEl: HTMLScriptElement | null = null;
    if (schema) {
      scriptEl = document.createElement('script');
      scriptEl.type = 'application/ld+json';
      scriptEl.id = 'dynamic-page-schema';
      scriptEl.text = JSON.stringify(schema);
      document.head.appendChild(scriptEl);
    }

    return () => {
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, [title, description, canonical, image, type, schema]);

  return null;
};
