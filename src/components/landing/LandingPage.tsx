import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingValueProp } from './LandingValueProp';
import { LandingFeatures } from './LandingFeatures';
import { LandingToolGrid } from './LandingToolGrid';
import { LandingFAQ } from './LandingFAQ';
import { LandingAppBanner } from './LandingAppBanner';
import { LandingResources } from './LandingResources';
import { LandingFooter } from './LandingFooter';
import { ToastContainer } from '../common/ToastContainer';

export const LandingPage: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-white text-slate-900 overflow-y-auto overflow-x-hidden selection:bg-[#3B82F6] selection:text-white font-sans antialiased scroll-smooth">
      {/* 1. Sticky Navbar */}
      <LandingNavbar />

      {/* 2. Hero Section with Interactive Mockup */}
      <main>
        <LandingHero />

        {/* 3. Value Proposition Section */}
        <LandingValueProp />

        {/* 4. Core Features Showcase (Alternating Blocks) */}
        <LandingFeatures />

        {/* 5. Tools & Platform Grid (Reusable Array-Fed Component) */}
        <LandingToolGrid />

        {/* 6. Accessible FAQ Accordion */}
        <LandingFAQ />

        {/* 7. Mobile App & Cross-Device Sync Banner */}
        <LandingAppBanner />

        {/* 8. Educational Resources & Creator Guides */}
        <LandingResources />
      </main>

      {/* 9. Comprehensive Footer */}
      <LandingFooter />

      {/* Global Notifications */}
      <ToastContainer />
    </div>
  );
};

export default LandingPage;
