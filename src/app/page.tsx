import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "ShopHub - Your One-Stop E-Commerce Platform",
  description: "Discover amazing products at great prices. Shop the latest trends with free shipping on orders over $50.",
};

const featuredCategories = [
  { name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1498049794561-7782213c9570?w=400&h=400&fit=crop", productCount: 156 },
  { name: "Clothing", slug: "clothing", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop", productCount: 234 },
  { name: "Home & Garden", slug: "home-garden", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop", productCount: 89 },
  { name: "Sports", slug: "sports", image: "https://images.unsplash.com/photo-1461896836934-bd45ba419dcd?w=400&h=400&fit=crop", productCount: 67 },
];

const popularProducts = [
  { id: "1", name: "Wireless Bluetooth Headphones", slug: "wireless-bluetooth-headphones", sku: "WBH-001", price: 79.99, comparePrice: 99.99, isActive: true, isFeatured: true, quantity: 25, createdAt: new Date(), category: { id: "1", name: "Electronics", slug: "electronics" }, images: [{ id: "1", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", alt: "Headphones", position: 0, isPrimary: true, productId: "1" }], variants: [], reviews: [{ rating: 5 }, { rating: 4 }], _count: { reviews: 24 } },
  { id: "2", name: "Premium Cotton T-Shirt", slug: "premium-cotton-t-shirt", sku: "PCT-002", price: 29.99, comparePrice: null, isActive: true, isFeatured: true, quantity: 50, createdAt: new Date(), category: { id: "2", name: "Clothing", slug: "clothing" }, images: [{ id: "2", url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", alt: "T-Shirt", position: 0, isPrimary: true, productId: "2" }], variants: [], reviews: [{ rating: 5 }], _count: { reviews: 18 } },
  { id: "3", name: "Smart Fitness Watch", slug: "smart-fitness-watch", sku: "SFW-003", price: 199.99, comparePrice: 249.99, isActive: true, isFeatured: true, quantity: 15, createdAt: new Date(), category: { id: "1", name: "Electronics", slug: "electronics" }, images: [{ id: "3", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", alt: "Watch", position: 0, isPrimary: true, productId: "3" }], variants: [], reviews: [{ rating: 4 }, { rating: 5 }], _count: { reviews: 42 } },
  { id: "4", name: "Minimalist Desk Lamp", slug: "minimalist-desk-lamp", sku: "MDL-004", price: 49.99, comparePrice: null, isActive: true, isFeatured: false, quantity: 30, createdAt: new Date(), category: { id: "3", name: "Home & Garden", slug: "home-garden" }, images: [{ id: "4", url: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop", alt: "Lamp", position: 0, isPrimary: true, productId: "4" }], variants: [], reviews: [{ rating: 5 }], _count: { reviews: 12 } },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gray-900 text-white">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <Badge className="mb-4" variant="secondary">New Collection</Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Discover Amazing Products
              </h1>
              <p className="mt-6 text-lg text-gray-300">
                Shop the latest trends with free shipping on orders over $50.
                Quality products, great prices, exceptional service.
              </p>
              <div className="mt-8 flex gap-4">
                <Link href="/shop">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                  <p className="text-xs text-gray-500">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                  <p className="text-xs text-gray-500">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                  <p className="text-xs text-gray-500">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">24/7 Support</p>
                  <p className="text-xs text-gray-500">Dedicated support team</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
              <p className="mt-2 text-gray-500">Find exactly what you need</p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {featuredCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="group relative overflow-hidden rounded-xl"
                >
                  <div className="aspect-square">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                    <p className="text-sm text-gray-200">{category.productCount} products</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                <p className="mt-2 text-gray-500">Handpicked products just for you</p>
              </div>
              <Link href="/shop">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-gray-900 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white">Stay in the Loop</h2>
            <p className="mt-2 text-gray-300">
              Subscribe to our newsletter for exclusive deals and new arrivals
            </p>
            <form className="mt-8 mx-auto flex max-w-md gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:border-white focus:outline-none"
              />
              <Button className="bg-white text-gray-900 hover:bg-gray-100">Subscribe</Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
