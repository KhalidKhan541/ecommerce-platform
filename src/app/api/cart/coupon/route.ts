import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code } = body;

  if (code === "SAVE10") {
    return NextResponse.json({
      success: true,
      coupon: { code: "SAVE10", discountType: "PERCENTAGE", discountValue: 10 },
    });
  }

  return NextResponse.json(
    { success: false, error: "Invalid coupon code" },
    { status: 400 }
  );
}

export async function DELETE() {
  return NextResponse.json({ success: true });
}
