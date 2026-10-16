import React from 'react';
import EyeScrollVideo from '../components/home/EyeScrollVideo';
import TrustStrip from '../components/home/TrustStrip';
import AboutSection from '../components/home/AboutSection';
import SpecialtiesSection from '../components/home/SpecialtiesSection';
import DoctorSection from '../components/home/DoctorSection';
import TechnologySection from '../components/home/TechnologySection';
import ReviewsSection from '../components/home/ReviewsSection';
import LocationSection from '../components/home/LocationSection';
import FAQSection from '../components/home/FAQSection';
import FinalCTA from '../components/home/FinalCTA';
import KnowledgeHubSection from '../components/home/KnowledgeHubSection';
export default function Home({ currentLang = 'en' }) {
  return (
    <div className="flex-1 pb-16 lg:pb-0 overflow-x-clip w-full">
      {/* Interactive Scroll-controlled Eye Disassembly Hero */}
      <EyeScrollVideo currentLang={currentLang} />

      {/* Clinical Credentials & Trust Strip */}
      <TrustStrip />

      {/* About Nirvaya & Clinical Story (Concise Preview) */}
      <AboutSection />

      {/* Core Clinical Specialties (4 Flagship Focus Areas) */}
      <SpecialtiesSection currentLang={currentLang} />

      {/* Specialist Spotlight: Dr Sandhya Gaur */}
      <DoctorSection />

      {/* Clinical Technology & OT Cleanroom Facility (3 Core Pillars) */}
      <TechnologySection />

      {/* Clinical Knowledge Hub: Articles & Research Publications */}
      <KnowledgeHubSection />

      {/* Patient Trust & Google Reviews */}
      <ReviewsSection />

      {/* Clinic Location, Hours & Map Directions */}
      <LocationSection />

      {/* Frequently Asked Questions */}
      <FAQSection currentLang={currentLang} />

      {/* Final Pre-Footer Call-To-Action */}
      <FinalCTA currentLang={currentLang} />
    </div>
  );
}
