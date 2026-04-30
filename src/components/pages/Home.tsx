"use client";

import { FC } from 'react';
// src/pages/Home.tsx
import Hero from '@/components/sections/Hero';
import TrustSection from '@/components/sections/TrustSection';
import TestimonialsSlider from '@/components/sections/TestimonialsSlider';
import PathwayFlowSection from "@/components/sections/PathwayFlowSection";
import GuidedFunnelSection from "@/components/sections/GuidedFunnelSection";
import FeaturedCourses from '@/components/sections/featuredcourses';
import ServicesPreview from '@/components/sections/servicepreview';
import WhyFailSection from '@/components/sections/WhyFailSection';
import PracticeTestsSection from '@/components/sections/practisetestsection';
import BlogPreviewSection from '@/components/sections/BlogPreviewSection';

const Home: FC = () => {
  return (
    <>
      <Hero />
      <GuidedFunnelSection />
      <PathwayFlowSection />
      <ServicesPreview />
      <FeaturedCourses />
      <WhyFailSection />
      <PracticeTestsSection />
      <BlogPreviewSection />
      <TrustSection />
      <TestimonialsSlider />
    </>
  );
};

export default Home;