import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { SEO } from '../components/common/SEO';
import { salesFaqs } from '../data/faqData';
import { HeroSection } from '../components/home/HeroSection';
import { TrustBar } from '../components/home/TrustBar';
import { MissionSection } from '../components/home/MissionSection';
import { VisionSection } from '../components/home/VisionSection';
import { MethodSteps } from '../components/home/MethodSteps';
import { WhyUsGrid } from '../components/home/WhyUsGrid';
import { GuaranteesPreview } from '../components/home/GuaranteesPreview';
import { RecentDeliveries } from '../components/home/RecentDeliveries';
import { KeyStatsSection } from '../components/home/KeyStatsSection';
import { TestimonialsSlider } from '../components/home/TestimonialsSlider';

export const HomePage = () => {
  const { settings } = useSettings();

  const homeStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        'name': 'Inter Cars Import',
        'legalName': 'INTER CARS IMPORT SAS',
        'identifier': '927942847',
        'taxID': 'FR42927942847',
        'vatID': 'FR42927942847',
        'url': 'https://inter-cars-import.fr',
        'logo': 'https://inter-cars-import.fr/logo.png',
        'image': 'https://inter-cars-import.fr/logo.png',
        'description': "Vente de véhicules d'occasion rigoureusement audités en 150 points de contrôle, issus directement de concessions officielles partenaires en France.",
        'telephone': settings.phoneRaw || '+33749180735',
        'email': settings.email || 'contact@inter-cars-import.fr',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '55 Av. Louis Breguet',
          'addressLocality': 'Toulouse',
          'postalCode': '31400',
          'addressCountry': 'FR'
        },
        'areaServed': {
          '@type': 'Country',
          'name': 'France'
        }
      },
      {
        '@type': 'FAQPage',
        'mainEntity': salesFaqs.map((faq) => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        }))
      }
    ]
  };

  return (
    <div className="space-y-0">
      <SEO
        title="Vente de Véhicules d'Occasion Certifiés en France"
        description="Inter Cars Import — Spécialiste de la vente de véhicules d'occasion récents audités en 150 points. Concessions partenaires exclusives en France, traçabilité et livraison clé en main."
        structuredData={homeStructuredData}
      />
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Bandeau de Confiance */}
      <TrustBar />

      {/* 3. Notre Mission */}
      <MissionSection />

      {/* 4. Notre Vision */}
      <VisionSection />

      {/* 5. Notre Méthode */}
      <MethodSteps />

      {/* 6. Pourquoi Nous */}
      <WhyUsGrid />

      {/* 7. Nos Garanties */}
      <GuaranteesPreview />

      {/* 8. Véhicules Livrés Récemment */}
      <RecentDeliveries />

      {/* 9. Statistiques Clés */}
      <KeyStatsSection />

      {/* 10. Témoignages */}
      <TestimonialsSlider />
    </div>
  );
};
