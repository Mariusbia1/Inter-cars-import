import React from 'react';
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
import { FinalCta } from '../components/home/FinalCta';

export const HomePage = () => {
  return (
    <div className="space-y-0">
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

      {/* 11. CTA Final */}
      <FinalCta />
    </div>
  );
};
