import { NextRequest, NextResponse } from "next/server";

const categories = [
  { id: "1", name: "Electronics", slug: "electronics", description: "Latest gadgets and devices", image: "https://images.unsplash.com/photo-1498049794561-7782213c9570?w=400&h=400&fit=crop", isActive: true, sortOrder: 0, metaTitle: null, metaDesc: null, createdAt: new Date(), updatedAt: new Date(), parentId: null, _count: { products: 156 } },
  { id: "2", name: "Clothing", slug: "clothing", description: "Fashion for everyone", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop", isActive: true, sortOrder: 1, metaTitle: null, metaDesc: null, createdAt: new Date(), updatedAt: new Date(), parentId: null, _count: { products: 234 } },
  { id: "3", name: "Home & Garden", slug: "home-garden", description: "Everything for your home", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop", isActive: true, sortOrder: 2, metaTitle: null, metaDesc: null, createdAt: new Date(), updatedAt: new Date(), parentId: null, _count: { products: 89 } },
  { id: "4", name: "Sports", slug: "sports", description: "Sports and outdoor gear", image: "https://images.unsplash.com/photo-1461896836934-bd45ba419dcd?w=400&h=400&fit=crop", isActive: true, sortOrder: 3, metaTitle: null, metaDesc: null, createdAt: new Date(), updatedAt: new Date(), parentId: null, _count: { products: 67 } },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: categories,
  });
}
