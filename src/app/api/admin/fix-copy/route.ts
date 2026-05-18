import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ServicePage from "@/models/Service";

export const dynamic = 'force-dynamic';

/**
 * One-time patch: Fix copy issues in MongoDB service records.
 * - "xpert, structured" → "Expert, structured" (IET description typo)
 * - "CANADIAN PEng" → "Canadian P.Eng" (title formatting)
 * - ICE description → strengthen "most demanding" claim
 * - Canadian P.Eng description → add CBA/provincial context
 * 
 * Call: GET /api/admin/fix-copy
 */
export async function GET() {
  try {
    await connectToDatabase();

    const results: Record<string, any> = {};

    // 1. Fix IET description typo (xpert → Expert)
    const ietResult = await ServicePage.updateMany(
      { description: { $regex: /xpert,\s*structured/i } },
      [
        {
          $set: {
            description: {
              $replaceAll: {
                input: "$description",
                find: "xpert, structured",
                replacement: "Expert, structured",
              },
            },
          },
        },
      ]
    );
    results.iet_typo_fix = { matched: ietResult.matchedCount, modified: ietResult.modifiedCount };

    // 2. Fix "CANADIAN PEng" title → "Canadian P.Eng"
    const titleResult = await ServicePage.updateMany(
      { title: "CANADIAN PEng" },
      { $set: { title: "Canadian P.Eng" } }
    );
    results.canadian_title_fix = { matched: titleResult.matchedCount, modified: titleResult.modifiedCount };

    // 3. Strengthen ICE description
    const iceResult = await ServicePage.updateMany(
      { pageId: "ICE" },
      {
        $set: {
          description:
            "Chartered Engineer (CEng) – ICE Professional Registration Support. ICE is widely regarded as one of the most demanding UK engineering registrations: it requires a detailed written report mapped to ICE attributes, strong demonstration of personal accountability, and a rigorous panel review covering Health & Safety, Sustainable Development, and whole-life project thinking. We guide you through every stage — attribute mapping, report structuring, sustainability framing, and mock review preparation.",
        },
      }
    );
    results.ice_description_fix = { matched: iceResult.matchedCount, modified: iceResult.modifiedCount };

    // 4. Strengthen Canadian P.Eng description
    const canadaResult = await ServicePage.updateMany(
      { pageId: "CANADIAN PEng" },
      {
        $set: {
          description:
            "Professional Engineer (P.Eng.) – Canadian Licensure Support. P.Eng. licensing is regulated provincially — requirements vary between PEO (Ontario), APEGA (Alberta), Engineers & Geoscientists BC, and others. We provide expert guidance on Competency-Based Assessment (CBA) writing across all 34 competencies, validator strategy, NPPE preparation, and end-to-end application support through your provincial regulator.",
        },
      }
    );
    results.canadian_description_fix = { matched: canadaResult.matchedCount, modified: canadaResult.modifiedCount };

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("fix-copy error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
