import React from 'react';
import LandingHeader from '@/components/LandingHeader';
import HeroSectionV3 from '@/components/HeroSectionV3';
import ProofBarSection from '@/components/ProofBarSection';
import PainRemedySection from '@/components/PainRemedySection';
import FAQSection from '@/components/FAQSection';
import CredibilityFooter from '@/components/CredibilityFooter';
import ScrollToTop from '@/components/ScrollToTop';

const LandingPageV3 = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-x-hidden font-sans selection:bg-[#39FF14] selection:text-[#0f172a]">
      <ScrollToTop />
      <LandingHeader />
      
      <main>
        <HeroSectionV3 />
        <ProofBarSection />
        <PainRemedySection />
        <FAQSection />
      </main>
      
      <CredibilityFooter />
    </div>
  );
};

export default LandingPageV3;
