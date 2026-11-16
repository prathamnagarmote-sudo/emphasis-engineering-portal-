import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Contact from "@/models/Contact";
import Log from "@/models/Log";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { evaluateEnquirySpam } from "@/lib/spam-filter";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const contacts = await Contact.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("Fetch contacts error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();
    await connectToDatabase();
    const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });

    return NextResponse.json({ contact });
  } catch (error) {
    console.error("Update contact error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ids, all, cleanupSpam } = body;
    await connectToDatabase();

    // 1. AI-Powered Spam Auto-Cleanup
    if (cleanupSpam) {
      const allContacts = await Contact.find({});
      const spamIds: string[] = [];

      for (const contact of allContacts) {
        const evaluation = evaluateEnquirySpam({
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          message: contact.message,
        });

        if (evaluation.isSpam) {
          spamIds.push(contact._id.toString());
        }
      }

      if (spamIds.length > 0) {
        await Contact.deleteMany({ _id: { $in: spamIds } });
        await Log.create({
          type: 'webhook',
          message: `Admin AI Cleanup: Purged ${spamIds.length} spam enquiries.`,
          details: { admin: (session.user as any).email, count: spamIds.length }
        });
      }

      return NextResponse.json({
        success: true,
        message: `Successfully cleaned ${spamIds.length} spam enquiries.`,
        deletedCount: spamIds.length,
        deletedIds: spamIds,
      });
    }

    // 2. Delete All Enquiries
    if (all === true) {
      const count = await Contact.countDocuments();
      await Contact.deleteMany({});
      await Log.create({
        type: 'webhook',
        message: `Admin deleted all ${count} enquiries.`,
        details: { admin: (session.user as any).email }
      });
      return NextResponse.json({
        success: true,
        message: `Deleted all ${count} enquiries successfully.`,
        deletedCount: count,
      });
    }

    // 3. Bulk Delete by Array of IDs
    if (Array.isArray(ids) && ids.length > 0) {
      await Contact.deleteMany({ _id: { $in: ids } });
      await Log.create({
        type: 'webhook',
        message: `Admin bulk-deleted ${ids.length} enquiries.`,
        details: { admin: (session.user as any).email, ids }
      });
      return NextResponse.json({
        success: true,
        message: `Deleted ${ids.length} enquiries successfully.`,
        deletedCount: ids.length,
        deletedIds: ids,
      });
    }

    // 4. Single Delete by ID
    if (id) {
      await Contact.findByIdAndDelete(id);
      await Log.create({
        type: 'webhook',
        message: `Admin deleted enquiry ${id}.`,
        details: { admin: (session.user as any).email, id }
      });
      return NextResponse.json({
        success: true,
        message: "Enquiry deleted successfully.",
        deletedId: id,
      });
    }

    return NextResponse.json({ error: "Missing deletion parameters" }, { status: 400 });
  } catch (error: any) {
    console.error("Delete contacts error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
