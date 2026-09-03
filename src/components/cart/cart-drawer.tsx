"use client";

import React from "react";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Thumbnail } from "@/components/ui/image";
import type { CartItemWithDetails } from "@/types";

interface CartDrawerProps {
  items: CartItemWithDetails[];
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

function CartDrawer({ items, isOpen, onClose, total }: CartDrawerProps) {
  if (!isOpen) return null;

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Shopping Cart ({itemCount})
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="mt-4 text-gray-500">Your cart is empty</p>
              <Link href="/shop" onClick={onClose}>
                <Button className="mt-4">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {items.map((item) => {
                const product = item.product;
                const variant = item.variant;
                const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
                const price = variant?.price || product.price;
                const lineTotal = price * item.quantity;

                return (
                  <div key={item.id} className="flex gap-4 py-4">
                    <Thumbnail
                      src={primaryImage?.url || "/images/placeholder.png"}
                      alt={product.name}
                      size="md"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/shop/${product.slug}`}
                          onClick={onClose}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600"
                        >
                          {product.name}
                        </Link>
                        {variant && (
                          <p className="text-xs text-gray-500">{variant.name}</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(lineTotal)}
                        </span>
                        <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold text-gray-900">{formatCurrency(total)}</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Shipping and taxes calculated at checkout
            </p>
            <Link href="/cart" className="block mt-4">
              <Button variant="outline" className="w-full" onClick={onClose}>
                View Cart
              </Button>
            </Link>
            <Link href="/checkout" className="block mt-2">
              <Button className="w-full" onClick={onClose}>
                Checkout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export { CartDrawer };
