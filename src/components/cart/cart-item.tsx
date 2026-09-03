"use client";

import React from "react";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Thumbnail } from "@/components/ui/image";
import type { CartItemWithDetails } from "@/types";

interface CartItemProps {
  item: CartItemWithDetails;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  className?: string;
}

function CartItem({ item, onUpdateQuantity, onRemove, className }: CartItemProps) {
  const product = item.product;
  const variant = item.variant;
  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const price = variant?.price || product.price;
  const maxQuantity = variant?.quantity || product.quantity;
  const lineTotal = price * item.quantity;

  return (
    <div className={cn("flex gap-4 py-4", className)}>
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
                className="text-sm font-semibold text-gray-900 hover:text-blue-600"
              >
                {product.name}
              </Link>
              {variant && (
                <p className="mt-0.5 text-xs text-gray-500">{variant.name}</p>
              )}
              <p className="mt-0.5 text-xs text-gray-500">SKU: {variant?.sku || product.sku}</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(lineTotal)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-gray-300">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              -
            </button>
            <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= maxQuantity}
              className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              +
            </button>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export { CartItem };
