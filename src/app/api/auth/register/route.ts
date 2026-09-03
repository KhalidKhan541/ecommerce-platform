import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { success: false, error: "Name, email, and password are required" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      user: { id: "user-2", name, email, role: "CUSTOMER" },
    },
  });
}
