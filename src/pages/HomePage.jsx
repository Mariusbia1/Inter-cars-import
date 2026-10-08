import React from 'react';
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
  const homeStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AutoDealer',
        'name': 'Inter Cars Import',
        'legalName': 'Inter Cars Import SAS',
        'url': 'https://inter-cars-import.fr',
        'logo': 'https://inter-cars-import.fr/logo.png',
        'image': 'https://inter-cars-import.fr/logo.png',
        'description': "Vente de véhicules d'occasion rigoureusement audités en 150 points de contrôle, issus directement de concessions officielles partenaires en France.",
        'priceRange': '€€€',
        'telephone': '+33493000000',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Cannes',
          'addressCountry': 'FR'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.9',
          'reviewCount': '128'
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
