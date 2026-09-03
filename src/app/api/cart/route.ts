import { NextRequest, NextResponse } from "next/server";

let cart = {
  id: "cart-1",
  token: "abc123",
  userId: "user-1",
  items: [
    {
      id: "item-1",
      quantity: 2,
      productId: "1",
      variantId: null,
      product: {
        id: "1",
        name: "Premium Wireless Headphones",
        slug: "premium-wireless-headphones",
        price: 149.99,
        images: [{ id: "1", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", alt: "Headphones", isPrimary: true }],
        quantity: 45,
      },
      variant: null,
    },
    {
      id: "item-2",
      quantity: 1,
      productId: "3",
      variantId: "v1",
      product: {
        id: "3",
        name: "Smart Fitness Watch",
        slug: "smart-fitness-watch",
        price: 199.99,
        images: [{ id: "3", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", alt: "Watch", isPrimary: true }],
        quantity: 30,
      },
      variant: { id: "v1", name: "Midnight Black", price: 199.99 },
    },
  ],
  coupon: null,
};

function calculateSummary(cartData: typeof cart) {
  const subtotal = cartData.items.reduce((sum, item) => {
    const price = item.variant?.price || item.product.price;
    return sum + price * item.quantity;
  }, 0);
  const tax = subtotal * 0.085;
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const discount = cartData.coupon ? subtotal * 0.1 : 0;
  const total = subtotal + tax + shipping - discount;
  const itemCount = cartData.items.reduce((sum, item) => sum + item.quantity, 0);

  return { items: cartData.items, subtotal, tax, shipping, discount, total, itemCount };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    cart,
    summary: calculateSummary(cart),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId, variantId, quantity = 1 } = body;

  const existingItem = cart.items.find(
    (item) => item.productId === productId && item.variantId === variantId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      id: `item-${Date.now()}`,
      quantity,
      productId,
      variantId: variantId || null,
      product: {
        id: productId,
        name: "Product",
        slug: "product",
        price: 99.99,
        images: [{ id: "1", url: "/images/placeholder.png", alt: "Product", isPrimary: true }],
        quantity: 100,
      },
      variant: variantId ? { id: variantId, name: "Variant", price: 99.99 } : null,
    });
  }

  return NextResponse.json({
    success: true,
    cart,
    summary: calculateSummary(cart),
  });
}
