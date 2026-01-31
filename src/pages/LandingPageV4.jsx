import React from 'react';
import LandingHeader from '@/components/LandingHeader';
import HeroSectionV4 from '@/components/HeroSectionV4';
import ROISection from '@/components/ROISection';
import PainExpansionSection from '@/components/PainExpansionSection';
import WhySection from '@/components/WhySection';
import BrainSection from '@/components/BrainSection';
import ForWhomSection from '@/components/ForWhomSection';
import SyncSection from '@/components/SyncSection';
import PricingSection from '@/components/PricingSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import FooterSection from '@/components/FooterSection';
import ScrollToTop from '@/components/ScrollToTop';

const LandingPageV4 = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-x-hidden font-sans selection:bg-[#39FF14] selection:text-[#0f172a]">
      <ScrollToTop />
      <LandingHeader />
      
      <main>
        <HeroSectionV4 />
        <ROISection />
        <PainExpansionSection />
        <WhySection />
        <BrainSection />
        <ForWhomSection />
        <SyncSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      
      <FooterSection />
    </div>
  );
};

export default LandingPageV4;
