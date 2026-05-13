import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
