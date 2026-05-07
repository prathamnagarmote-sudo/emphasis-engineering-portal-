import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ServicePage from "@/models/Service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const rawId = decodeURIComponent(resolvedParams.id);
    const searchId = rawId.toLowerCase().replace(/\s+/g, '-');

    const s = await ServicePage.findOne({ pageId: searchId }).lean();

    if (!s) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }

    const transformed = {
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
        content: step.content || "",
      })) || [],
      faqs: s.faqs || [],
      packages: s.services?.map((svc: any) => {
        let price = svc.price;
        // PRICE OVERRIDE: Set Interview Prep to 526 CAD to target ~£350 GBP
        if (s.title && s.title.toLowerCase().includes('interview preparation') && svc.title.toLowerCase().includes('standard')) {
          price = 526;
        }
        return {
          id: svc.serviceId,
          title: svc.title,
          description: svc.description,
          price: price,
          features: svc.features,
          calendlyUrl: svc.calendlyUrl,
        };
      }) || [],
      calendlyLink: s.services?.[0]?.calendlyUrl || "",
    };

    return NextResponse.json(transformed, { status: 200 });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
