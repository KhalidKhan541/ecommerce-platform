"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { Breadcrumbs } from "@/components/layout/navigation";
import { EmptyState } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingPage } from "@/components/ui/loading";
import type { CartWithItems, CartSummary as CartSummaryType } from "@/types";

export default function CartPage() {
  const [cart, setCart] = useState<CartWithItems | null>(null);
  const [summary, setSummary] = useState<CartSummaryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCart(data.cart);
      setSummary(data.summary);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    setIsUpdating(true);
    try {
      await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      await fetchCart();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setIsUpdating(true);
    try {
      await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
      await fetchCart();
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const applyCoupon = async (code: string) => {
    try {
      await fetch("/api/cart/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      await fetchCart();
    } catch (error) {
      console.error("Failed to apply coupon:", error);
    }
  };

  const removeCoupon = async () => {
    try {
      await fetch("/api/cart/coupon", { method: "DELETE" });
      await fetchCart();
    } catch (error) {
      console.error("Failed to remove coupon:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (isLoading) return <LoadingPage />;

  const items = cart?.items || [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ name: "Cart" }]} className="mb-6" />

          <h1 className="mb-8 text-3xl font-bold text-gray-900">
            Shopping Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
          </h1>

          {items.length === 0 ? (
            <EmptyState
              icon={
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="Your cart is empty"
              description="Looks like you haven't added any items to your cart yet."
              action={
                <Link href="/shop">
                  <Button>Start Shopping</Button>
                </Link>
              }
            />
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white px-6">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item as any}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              </div>

              <div>
                {summary && (
                  <CartSummary
                    summary={summary}
                    onApplyCoupon={applyCoupon}
                    onRemoveCoupon={removeCoupon}
                    isLoading={isUpdating}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
