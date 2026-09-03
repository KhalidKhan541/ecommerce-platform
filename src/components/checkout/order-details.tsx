"use client";

import React from "react";
import Link from "next/link";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thumbnail } from "@/components/ui/image";
import type { OrderWithDetails } from "@/types";

interface OrderDetailsProps {
  order: OrderWithDetails;
  className?: string;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
  ON_HOLD: "bg-amber-100 text-amber-800",
};

function OrderDetails({ order, className }: OrderDetailsProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order {order.orderNumber}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Placed on {formatDate(order.placedAt || order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={cn("text-sm", statusColors[order.status])}>
            {order.status}
          </Badge>
          {order.status === "PENDING" && (
            <Button variant="destructive" size="sm">
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-gray-200">
                {order.items.map((item) => {
                  const primaryImage = item.product?.images.find((img) => img.isPrimary) || item.product?.images[0];
                  return (
                    <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <Thumbnail
                        src={primaryImage?.url || "/images/placeholder.png"}
                        alt={item.name}
                        size="md"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-medium">{formatCurrency(order.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">{formatCurrency(order.shippingAmount)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Discount</span>
                    <span className="font-medium text-emerald-600">
                      -{formatCurrency(order.discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-base font-bold">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  <br />
                  {order.shippingAddress.address1}
                  {order.shippingAddress.address2 && (
                    <>, {order.shippingAddress.address2}</>
                  )}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.statusHistory.map((history, index) => (
                  <div key={history.id} className="flex gap-3">
                    <div className="relative">
                      <div
                        className={cn(
                          "h-3 w-3 rounded-full",
                          index === 0 ? "bg-gray-900" : "bg-gray-300"
                        )}
                      />
                      {index < order.statusHistory.length - 1 && (
                        <div className="absolute left-1.5 top-3 h-full w-px bg-gray-200" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{history.status}</p>
                      <p className="text-xs text-gray-500">{formatDate(history.createdAt)}</p>
                      {history.note && (
                        <p className="mt-1 text-xs text-gray-500">{history.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500">
                Need help?{" "}
                <Link href="/contact" className="text-blue-600 hover:underline">
                  Contact us
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export { OrderDetails };
