import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ServicePage from "@/models/Service";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const services = await ServicePage.find({}).sort({ createdAt: 1 }).lean();
    
    const transformed = services.map((s: any) => ({
      id: s.pageId,
      title: s.title,
      description: s.description,
      icon: s.icon || "Briefcase",
      image: s.image || "",
      features: s.features || [],
      steps: s.stepByStepProcess?.map((step: any) => ({
        step: step.stepNumber,
        title: step.title,
        description: step.description,
        icon: step.icon || "CheckSquare"
      })) || [],
      packages: s.services?.map((pkg: any) => {
        let price = pkg.price;
        // PRICE OVERRIDE: Set Interview Prep to 526 CAD to target ~£350 GBP
        if (s.title && s.title.toLowerCase().includes('interview preparation') && pkg.title.toLowerCase().includes('standard')) {
          price = 526;
        }
        return {
          id: pkg.serviceId,
          title: pkg.title,
          description: pkg.description,
          price: price,
          originalPrice: pkg.originalPrice,
          popular: pkg.popular || false,
          features: pkg.features || [],
          calendlyUrl: pkg.calendlyUrl
        };
      }) || [],
      faqs: s.faqs?.map((faq: any) => ({
        question: faq.question,
        answer: faq.answer
      })) || [],
      calendlyLink: s.services?.[0]?.calendlyUrl || "",
      phases: s.stepByStepProcess?.map((step: any) => ({
        step: step.stepNumber,
        title: step.title,
        description: step.description,
        content: step.content || ""
      })) || []
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Fetch services error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
