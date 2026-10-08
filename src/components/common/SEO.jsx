import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'Inter Cars Import';
const BASE_URL = 'https://inter-cars-import.fr';
const DEFAULT_IMAGE = `${BASE_URL}/logo.png`;
const DEFAULT_DESCRIPTION = "Inter Cars Import — Vente de véhicules d'occasion récents rigoureusement audités en 150 points de contrôle. Réseau de concessions partenaires exclusives en France, traçabilité et livraison clé en main.";

/**
 * Composant SEO dynamique pour la gestion des métadonnées, OpenGraph, Twitter Cards et Schema.org JSON-LD
 */
export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  type = 'website',
  structuredData = null,
  noIndex = false
}) => {
  const location = useLocation();
  const canonicalUrl = `${BASE_URL}${location.pathname}`;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Vente de Véhicules d'Occasion & Partenaires Exclusifs en France`;

  useEffect(() => {
    // 1. Titre de la page
    document.title = fullTitle;

    // Fonction utilitaire pour mettre à jour ou créer une balise meta
    const setMetaTag = (attrName, attrValue, contentValue) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue || '');
    };

    // 2. Métadonnées standards
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // 3. Balise Canonical
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 4. OpenGraph (Facebook, WhatsApp, LinkedIn)
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', image.startsWith('http') ? image : `${BASE_URL}${image}`);
    setMetaTag('property', 'og:locale', 'fr_FR');

    // 5. Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image.startsWith('http') ? image : `${BASE_URL}${image}`);

    // 6. Données Structurées Schema.org JSON-LD
    let scriptTag = document.getElementById('dynamic-seo-jsonld');
    if (structuredData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'dynamic-seo-jsonld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [fullTitle, description, image, canonicalUrl, type, structuredData, noIndex]);

  return null;
};
