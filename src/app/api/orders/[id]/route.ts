import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const order = {
    id: params.id,
    orderNumber: "ORD-001",
    status: "SHIPPED",
    paymentStatus: "PAID",
    fulfillmentStatus: "SHIPPED",
    currency: "USD",
    subtotal: 149.99,
    taxAmount: 12.75,
    shippingAmount: 0,
    discountAmount: 0,
    total: 162.74,
    createdAt: new Date(),
    placedAt: new Date(),
    items: [
      { id: "1", name: "Premium Wireless Headphones", sku: "PWH-001", price: 149.99, quantity: 1, total: 149.99, product: { images: [] } },
    ],
    shippingAddress: { firstName: "John", lastName: "Doe", address1: "123 Main St", city: "New York", state: "NY", postalCode: "10001" },
    statusHistory: [
      { id: "1", status: "PENDING", createdAt: new Date(), note: null },
      { id: "2", status: "CONFIRMED", createdAt: new Date(), note: null },
      { id: "3", status: "SHIPPED", createdAt: new Date(), note: "Tracking: 1Z999AA10123456784" },
    ],
  };

  return NextResponse.json({
    success: true,
    data: order,
  });
}
