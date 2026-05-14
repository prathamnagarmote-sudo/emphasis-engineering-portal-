import Services from "@/components/pages/Services";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Mentorship & Licensure Roadmaps",
  description: "Explore our expert-led mentorship services for UK CEng, Canadian P.Eng, and US PE certifications. Personalized guidance for application support and professional reviews.",
};

export default function Page() { return <Services />; }
