import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductReviews } from "@/components/product/product-reviews";
import { Breadcrumbs } from "@/components/layout/navigation";

interface ProductPageProps {
  params: { slug: string };
}

async function getProduct(slug: string) {
  return {
    id: "1",
    name: "Premium Wireless Headphones",
    slug: "premium-wireless-headphones",
    description: "Experience crystal-clear audio with our premium wireless headphones. Featuring advanced noise cancellation technology, 30-hour battery life, and ultra-comfortable memory foam ear cushions. Perfect for music lovers, remote workers, and anyone who demands the best sound quality.",
    shortDesc: "Premium wireless headphones with noise cancellation and 30-hour battery life",
    sku: "PWH-001",
    price: 149.99,
    comparePrice: 199.99,
    costPrice: 45.00,
    currency: "USD",
    taxRate: 8.5,
    isActive: true,
    isFeatured: true,
    isDigital: false,
    weight: 0.35,
    length: 20,
    width: 18,
    height: 8,
    metaTitle: "Premium Wireless Headphones - ShopHub",
    metaDesc: "Shop premium wireless headphones with noise cancellation. 30-hour battery, memory foam cushions, Hi-Fi audio.",
    tags: ["wireless", "headphones", "audio", "noise-cancellation"],
    brand: "AudioTech",
    vendor: "TechAudio Inc.",
    quantity: 45,
    lowStockThreshold: 10,
    trackInventory: true,
    allowBackorder: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: "1",
    category: { id: "1", name: "Electronics", slug: "electronics", description: null, image: null, isActive: true, sortOrder: 0, metaTitle: null, metaDesc: null, createdAt: new Date(), updatedAt: new Date(), parentId: null },
    images: [
      { id: "1", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop", alt: "Headphones Front", position: 0, isPrimary: true, productId: "1" },
      { id: "2", url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop", alt: "Headphones Side", position: 1, isPrimary: false, productId: "1" },
      { id: "3", url: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&h=800&fit=crop", alt: "Headphones Detail", position: 2, isPrimary: false, productId: "1" },
    ],
    variants: [
      { id: "v1", name: "Midnight Black", sku: "PWH-001-BK", price: 149.99, comparePrice: 199.99, quantity: 25, isActive: true, options: { color: "Black" }, productId: "1" },
      { id: "v2", name: "Pearl White", sku: "PWH-001-WH", price: 149.99, comparePrice: 199.99, quantity: 20, isActive: true, options: { color: "White" }, productId: "1" },
    ],
    reviews: [
      { id: "r1", rating: 5, title: "Best headphones I've ever owned!", comment: "The noise cancellation is incredible and the battery lasts forever. Highly recommend!", isApproved: true, createdAt: new Date(), updatedAt: new Date(), userId: "u1", productId: "1", user: { id: "u1", name: "John D.", image: null }, images: [], helpful: null },
      { id: "r2", rating: 4, title: "Great sound quality", comment: "Very comfortable for long listening sessions. Sound quality is top-notch.", isApproved: true, createdAt: new Date(), updatedAt: new Date(), userId: "u2", productId: "1", user: { id: "u2", name: "Sarah M.", image: null }, images: [], helpful: null },
      { id: "r3", rating: 5, title: "Perfect for work from home", comment: "The microphone quality is excellent for video calls. Battery easily lasts a full work week.", isApproved: true, createdAt: new Date(), updatedAt: new Date(), userId: "u3", productId: "1", user: { id: "u3", name: "Mike R.", image: null }, images: [], helpful: null },
    ],
    tagsRelations: [
      { id: "t1", name: "Wireless", slug: "wireless" },
      { id: "t2", name: "Headphones", slug: "headphones" },
    ],
    _count: { reviews: 47, orderItems: 156 },
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.metaTitle || `${product.name} - ShopHub`,
    description: product.metaDesc || product.shortDesc || "",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  const summary = {
    averageRating: 4.7,
    totalReviews: 47,
    distribution: { 5: 32, 4: 10, 3: 3, 2: 1, 1: 1 },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { name: "Shop", href: "/shop" },
              { name: product.category?.name || "Products", href: `/categories/${product.category?.slug}` },
              { name: product.name },
            ]}
            className="mb-6"
          />

          <div className="grid gap-8 lg:grid-cols-2">
            <ProductGallery images={product.images} productName={product.name} />
            <ProductInfo product={product as any} />
          </div>

          <div className="mt-16">
            <ProductReviews
              reviews={product.reviews as any}
              summary={summary}
              productId={product.id}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
