"use client";

import React, { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import type { ProductWithDetails, ProductVariant } from "@/types";

interface ProductInfoProps {
  product: ProductWithDetails;
  className?: string;
}

function ProductInfo({ product, className }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  const displayPrice = selectedVariant?.price || product.price;
  const displayComparePrice = selectedVariant?.comparePrice || product.comparePrice;
  const displaySku = selectedVariant?.sku || product.sku;
  const displayQuantity = selectedVariant?.quantity || product.quantity;
  const hasDiscount = displayComparePrice && displayComparePrice > displayPrice;
  const discountPercent = hasDiscount
    ? Math.round(((displayComparePrice! - displayPrice) / displayComparePrice!) * 100)
    : 0;

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;

  const handleAddToCart = async () => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariant?.id,
          quantity,
        }),
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Title & Rating */}
      <div>
        {product.brand && (
          <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
            {product.brand}
          </p>
        )}
        <h1 className="mt-1 text-3xl font-bold text-gray-900">{product.name}</h1>
        <div className="mt-3 flex items-center gap-4">
          {averageRating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={cn("h-5 w-5", i < Math.round(averageRating) ? "fill-current" : "fill-gray-200")}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product._count.reviews} reviews)
              </span>
            </div>
          )}
          <span className="text-sm text-gray-500">SKU: {displaySku}</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-gray-900">{formatCurrency(displayPrice)}</span>
        {hasDiscount && (
          <>
            <span className="text-lg text-gray-400 line-through">{formatCurrency(displayComparePrice!)}</span>
            <Badge variant="danger">Save {discountPercent}%</Badge>
          </>
        )}
      </div>

      {/* Description */}
      {(product.shortDesc || product.description) && (
        <div className="prose prose-sm text-gray-600">
          <p>{product.shortDesc || product.description}</p>
        </div>
      )}

      {/* Variants */}
      {product.variants.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900">Options</h3>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(selectedVariant?.id === variant.id ? null : variant)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                  selectedVariant?.id === variant.id
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 text-gray-700 hover:border-gray-400",
                  variant.quantity === 0 && "opacity-50 cursor-not-allowed"
                )}
                disabled={variant.quantity === 0}
              >
                {variant.name}
                {variant.quantity === 0 && " (Out of Stock)"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-gray-300">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-10 w-10 items-center justify-center text-gray-600 hover:bg-gray-50"
            >
              -
            </button>
            <span className="w-12 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(displayQuantity, quantity + 1))}
              className="flex h-10 w-10 items-center justify-center text-gray-600 hover:bg-gray-50"
            >
              +
            </button>
          </div>
          <span className="text-sm text-gray-500">
            {displayQuantity > 0 ? `${displayQuantity} available` : "Out of stock"}
          </span>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={displayQuantity === 0}
        >
          {displayQuantity === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
        <Button size="lg" variant="outline">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </Button>
      </div>

      {/* Features */}
      <div className="space-y-3 border-t border-gray-200 pt-6">
        <h3 className="text-sm font-medium text-gray-900">Product Details</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Category</dt>
            <dd className="font-medium text-gray-900">{product.category?.name || "N/A"}</dd>
          </div>
          {product.brand && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Brand</dt>
              <dd className="font-medium text-gray-900">{product.brand}</dd>
            </div>
          )}
          {product.weight && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Weight</dt>
              <dd className="font-medium text-gray-900">{product.weight} kg</dd>
            </div>
          )}
          {product.tagsRelations.length > 0 && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Tags</dt>
              <dd className="flex flex-wrap gap-1">
                {product.tagsRelations.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Shipping Info */}
      <div className="rounded-lg bg-gray-50 p-4">
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-gray-900">Free shipping on orders over $50</p>
            <p className="text-gray-500">Estimated delivery: 3-5 business days</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ProductInfo };
