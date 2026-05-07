import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Voucher from "@/models/Voucher";

export async function POST(req: Request) {
  try {
    const { code, type } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    await connectToDatabase();

    const voucher = await Voucher.findOne({ 
      code: code.toUpperCase(), 
      isUsed: false 
    });

    if (!voucher) {
      return NextResponse.json({ error: "Invalid or expired voucher code" }, { status: 400 });
    }

    // Check if voucher is applicable to this item type
    if (voucher.type !== 'all' && type && voucher.type !== type) {
      const typeLabel = voucher.type === 'practice-test' ? 'practice tests' : `${voucher.type}s`;
      return NextResponse.json({ 
        error: `This voucher is only valid for ${typeLabel}.` 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      discountValue: voucher.discountValue,
      discountType: voucher.discountType 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
