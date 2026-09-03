"use client";

import React from "react";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Thumbnail } from "@/components/ui/image";
import type { ProductListItem } from "@/types";

interface ProductCardProps {
  product: ProductListItem;
  className?: string;
  layout?: "grid" | "list";
}

function ProductCard({ product, className, layout = "grid" }: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;
  const isOutOfStock = product.quantity === 0;

  if (layout === "list") {
    return (
      <div className={cn("group flex gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md", className)}>
        <Link href={`/shop/${product.slug}`} className="flex-shrink-0">
          <Thumbnail
            src={primaryImage?.url || "/images/placeholder.png"}
            alt={product.name}
            size="lg"
          />
        </Link>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link
                  href={`/shop/${product.slug}`}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                >
                  {product.name}
                </Link>
                {product.category && (
                  <p className="text-sm text-gray-500">{product.category.name}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</p>
                {hasDiscount && (
                  <p className="text-sm text-gray-400 line-through">{formatCurrency(product.comparePrice!)}</p>
                )}
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
              {product.shortDesc || `SKU: ${product.sku}`}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-4">
            {averageRating > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={cn("h-4 w-4", i < Math.round(averageRating) ? "fill-current" : "fill-gray-200")}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product._count.reviews})</span>
              </div>
            )}
            <div className="ml-auto flex gap-2">
              {isOutOfStock ? (
                <Button disabled size="sm">Out of Stock</Button>
              ) : (
                <Button size="sm">Add to Cart</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg", className)}>
      <Link href={`/shop/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={primaryImage?.url || "/images/placeholder.png"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isFeatured && (
            <Badge variant="secondary">Featured</Badge>
          )}
          {hasDiscount && (
            <Badge variant="danger">-{discountPercent}%</Badge>
          )}
          {isOutOfStock && (
            <Badge variant="warning">Out of Stock</Badge>
          )}
        </div>
        <button className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-600 opacity-0 transition-opacity hover:bg-white hover:text-red-500 group-hover:opacity-100">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {product.category && (
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            {product.category.name}
          </p>
        )}
        <Link
          href={`/shop/${product.slug}`}
          className="mt-1 text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
        >
          {product.name}
        </Link>

        {averageRating > 0 && (
          <div className="mt-2 flex items-center gap-1">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={cn("h-3 w-3", i < Math.round(averageRating) ? "fill-current" : "fill-gray-200")}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">({product._count.reviews})</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <div>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</p>
            {hasDiscount && (
              <p className="text-sm text-gray-400 line-through">{formatCurrency(product.comparePrice!)}</p>
            )}
          </div>
          {isOutOfStock ? (
            <Button disabled size="sm" variant="outline">Sold Out</Button>
          ) : (
            <Button size="sm">Add to Cart</Button>
          )}
        </div>
      </div>
    </div>
  );
}

export { ProductCard };
