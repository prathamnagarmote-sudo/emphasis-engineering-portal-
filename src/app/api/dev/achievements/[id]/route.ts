import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Achievement from "@/models/Achievement";
import { verifyDevAuth, unauthorized } from "@/lib/devAuth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyDevAuth(req)) return unauthorized();

    await connectToDatabase();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();

    const updated = await Achievement.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating achievement:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyDevAuth(req)) return unauthorized();

    await connectToDatabase();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const deleted = await Achievement.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting achievement:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
