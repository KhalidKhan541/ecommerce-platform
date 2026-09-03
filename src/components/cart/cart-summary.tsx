"use client";

import React, { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CartSummary as CartSummaryType } from "@/types";

interface CartSummaryProps {
  summary: CartSummaryType;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  isLoading?: boolean;
  className?: string;
}

function CartSummary({
  summary,
  onApplyCoupon,
  onRemoveCoupon,
  isLoading,
  className,
}: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setCouponError("");
    onApplyCoupon(couponCode);
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Subtotal ({summary.itemCount} {summary.itemCount === 1 ? "item" : "items"})
          </span>
          <span className="font-medium text-gray-900">{formatCurrency(summary.subtotal)}</span>
        </div>

        {/* Discount */}
        {summary.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Discount</span>
            <span className="font-medium text-emerald-600">
              -{formatCurrency(summary.discount)}
            </span>
          </div>
        )}

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tax</span>
          <span className="font-medium text-gray-900">{formatCurrency(summary.tax)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Shipping</span>
          <span className="font-medium text-gray-900">
            {summary.shipping === 0 ? "Free" : formatCurrency(summary.shipping)}
          </span>
        </div>

        {/* Coupon Code */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex gap-2">
            <Input
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              error={couponError}
            />
            <Button
              variant="outline"
              onClick={handleApplyCoupon}
              disabled={isLoading}
            >
              Apply
            </Button>
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-base font-bold text-gray-900">
              {formatCurrency(summary.total)}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Including all applicable taxes
          </p>
        </div>

        {/* Checkout Button */}
        <Link href="/checkout" className="block">
          <Button size="lg" className="w-full">
            Proceed to Checkout
          </Button>
        </Link>

        {/* Continue Shopping */}
        <Link href="/shop" className="block text-center">
          <Button variant="ghost" size="lg" className="w-full">
            Continue Shopping
          </Button>
        </Link>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 pt-4 text-gray-400">
          <div className="flex items-center gap-1 text-xs">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure Checkout
          </div>
          <div className="flex items-center gap-1 text-xs">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Buyer Protection
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { CartSummary };
