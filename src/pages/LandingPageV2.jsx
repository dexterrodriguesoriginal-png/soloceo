import React from 'react';
import LandingHeader from '@/components/LandingHeader';
import HeroSectionV2 from '@/components/HeroSectionV2';
import PainSectionV2 from '@/components/PainSectionV2';
import SolutionSectionV2 from '@/components/SolutionSectionV2';
import ProofSectionV2 from '@/components/ProofSectionV2';
import FAQSectionV2 from '@/components/FAQSectionV2';
import FooterSectionV2 from '@/components/FooterSectionV2';

const LandingPageV2 = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-x-hidden font-sans selection:bg-[#22c55e]/30 selection:text-[#22c55e]">
      <LandingHeader />
      
      <main>
        <HeroSectionV2 />
        <PainSectionV2 />
        <SolutionSectionV2 />
        <ProofSectionV2 />
        <FAQSectionV2 />
      </main>
      
      <FooterSectionV2 />
    </div>
  );
};

export default LandingPageV2;
