import ServiceDetail from "@/components/pages/ServiceDetail";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/services/${decodedId}`);
    if (!res.ok) return { title: "Service Details" };
    const service = await res.json();

    return {
      title: `${service.title} Support`,
      description: service.description || `Expert-led professional guidance and mentorship for ${service.title} engineering certification.`,
      openGraph: {
        title: `${service.title} | Emphasis Engineering`,
        description: service.description,
        images: [service.image || "https://res.cloudinary.com/dwk1cnlw2/image/upload/v1775721626/logo-nobackground-500_prbht7.png"],
      },
    };
  } catch (error) {
    return { title: "Service Details" };
  }
}

export default function Page() { return <ServiceDetail />; }
