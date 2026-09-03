import { NextRequest, NextResponse } from "next/server";

// Simulated product data
const products = [
  { id: "1", name: "Premium Wireless Headphones", slug: "premium-wireless-headphones", sku: "PWH-001", price: 149.99, comparePrice: 199.99, isActive: true, isFeatured: true, quantity: 45, createdAt: new Date(), categoryId: "1", category: { id: "1", name: "Electronics", slug: "electronics" }, images: [{ id: "1", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", alt: "Headphones", position: 0, isPrimary: true, productId: "1" }], variants: [], reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }], _count: { reviews: 47 } },
  { id: "2", name: "Premium Cotton T-Shirt", slug: "premium-cotton-t-shirt", sku: "PCT-002", price: 29.99, comparePrice: null, isActive: true, isFeatured: true, quantity: 150, createdAt: new Date(), categoryId: "2", category: { id: "2", name: "Clothing", slug: "clothing" }, images: [{ id: "2", url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", alt: "T-Shirt", position: 0, isPrimary: true, productId: "2" }], variants: [], reviews: [{ rating: 5 }], _count: { reviews: 18 } },
  { id: "3", name: "Smart Fitness Watch", slug: "smart-fitness-watch", sku: "SFW-003", price: 199.99, comparePrice: 249.99, isActive: true, isFeatured: true, quantity: 30, createdAt: new Date(), categoryId: "1", category: { id: "1", name: "Electronics", slug: "electronics" }, images: [{ id: "3", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", alt: "Watch", position: 0, isPrimary: true, productId: "3" }], variants: [], reviews: [{ rating: 4 }, { rating: 5 }], _count: { reviews: 42 } },
  { id: "4", name: "Minimalist Desk Lamp", slug: "minimalist-desk-lamp", sku: "MDL-004", price: 49.99, comparePrice: null, isActive: true, isFeatured: false, quantity: 60, createdAt: new Date(), categoryId: "3", category: { id: "3", name: "Home & Garden", slug: "home-garden" }, images: [{ id: "4", url: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop", alt: "Lamp", position: 0, isPrimary: true, productId: "4" }], variants: [], reviews: [{ rating: 5 }], _count: { reviews: 12 } },
  { id: "5", name: "Running Shoes Pro", slug: "running-shoes-pro", sku: "RSP-005", price: 129.99, comparePrice: 159.99, isActive: true, isFeatured: false, quantity: 40, createdAt: new Date(), categoryId: "4", category: { id: "4", name: "Sports", slug: "sports" }, images: [{ id: "5", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", alt: "Shoes", position: 0, isPrimary: true, productId: "5" }], variants: [], reviews: [{ rating: 4 }], _count: { reviews: 35 } },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const search = searchParams.get("q") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const sortBy = searchParams.get("sortBy") || "newest";
  const minPrice = parseFloat(searchParams.get("minPrice") || "0");
  const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999");

  let filtered = products.filter((p) => p.isActive);

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }

  if (categoryId) {
    filtered = filtered.filter((p) => p.categoryId === categoryId);
  }

  filtered = filtered.filter((p) => p.price >= minPrice && p.price <= maxPrice);

  switch (sortBy) {
    case "price_asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "bestselling":
      filtered.sort((a, b) => b._count.reviews - a._count.reviews);
      break;
    default:
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return NextResponse.json({
    success: true,
    data,
    pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
  });
}
