import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Voucher from "@/models/Voucher";
import crypto from 'crypto';

function generateUniqueCode(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$'; // Excluded confusing chars like 0, O, 1, I
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();
    const vouchers = await Voucher.find().sort({ createdAt: -1 });
    return NextResponse.json({ vouchers });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();
    const { code, discountValue, type } = await req.json();

    let voucherCode = code ? code.toUpperCase() : generateUniqueCode();
    
    // Ensure uniqueness if randomized
    if (!code) {
      let isUnique = false;
      while (!isUnique) {
        const existing = await Voucher.findOne({ code: voucherCode });
        if (!existing) {
          isUnique = true;
        } else {
          voucherCode = generateUniqueCode();
        }
      }
    } else {
      const existing = await Voucher.findOne({ code: voucherCode });
      if (existing) {
        return NextResponse.json({ error: "Voucher code already exists" }, { status: 400 });
      }
    }

    const voucher = await Voucher.create({
      code: voucherCode,
      discountValue: discountValue || 30,
      discountType: 'percentage',
      type: type || 'service',
      createdBy: (session.user as any).id
    });

    return NextResponse.json({ success: true, voucher });
  } catch (error: any) {
    console.error("Voucher creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
