import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "Email and password are required" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      user: { id: "user-1", name: "John Doe", email, role: "CUSTOMER" },
      token: "jwt-token-here",
    },
  });
}
