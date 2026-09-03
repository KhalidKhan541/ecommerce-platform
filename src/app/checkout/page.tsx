"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Breadcrumbs } from "@/components/layout/navigation";
import { LoadingPage } from "@/components/ui/loading";
import type { CartItemWithDetails, CartSummary } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItemWithDetails[]>([]);
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setItems(data.cart?.items || []);
      setSummary(data.summary);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/orders/${data.data.id}`);
      }
    } catch (error) {
      console.error("Failed to create order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (isLoading) return <LoadingPage />;

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ name: "Cart", href: "/cart" }, { name: "Checkout" }]}
            className="mb-6"
          />

          <h1 className="mb-8 text-3xl font-bold text-gray-900">Checkout</h1>

          <CheckoutForm
            items={items as any}
            summary={summary!}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
