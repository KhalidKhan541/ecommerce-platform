import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const order = {
    id: `order-${Date.now()}`,
    orderNumber: `ORD-${String(Date.now()).slice(-6)}`,
    status: "PENDING",
    paymentStatus: "PAID",
    total: 299.98,
    createdAt: new Date(),
    items: [],
  };

  return NextResponse.json({
    success: true,
    data: order,
  });
}

export async function GET(request: NextRequest) {
  const orders = [
    { id: "1", orderNumber: "ORD-001", status: "SHIPPED", total: 149.99, createdAt: new Date() },
    { id: "2", orderNumber: "ORD-002", status: "PENDING", total: 79.98, createdAt: new Date() },
  ];

  return NextResponse.json({
    success: true,
    data: orders,
  });
}
