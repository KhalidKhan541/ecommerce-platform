"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DashboardSidebar } from "@/components/layout/sidebar";
import { PageHeader } from "@/components/layout/navigation";
import { StatCard } from "@/components/ui/card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import { DataTable, Column } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { OrderListItem } from "@/types";

const recentOrders: OrderListItem[] = [
  { id: "1", orderNumber: "ORD-001", status: "SHIPPED", paymentStatus: "PAID", total: 149.99, createdAt: new Date(), items: [{ name: "Wireless Headphones", quantity: 1, price: 149.99, product: { images: [] } }] },
  { id: "2", orderNumber: "ORD-002", status: "PENDING", paymentStatus: "PAID", total: 79.98, createdAt: new Date(), items: [{ name: "Cotton T-Shirt", quantity: 2, price: 29.99, product: { images: [] } }, { name: "Desk Lamp", quantity: 1, price: 49.99, product: { images: [] } }] },
  { id: "3", orderNumber: "ORD-003", status: "DELIVERED", paymentStatus: "PAID", total: 249.99, createdAt: new Date(), items: [{ name: "Smart Watch", quantity: 1, price: 249.99, product: { images: [] } }] },
  { id: "4", orderNumber: "ORD-004", status: "PROCESSING", paymentStatus: "PAID", total: 89.97, createdAt: new Date(), items: [{ name: "Fitness Band", quantity: 1, price: 39.99, product: { images: [] } }, { name: "Running Shoes", quantity: 1, price: 49.98, product: { images: [] } }] },
];

const statusColors: Record<string, "success" | "warning" | "info" | "danger" | "secondary"> = {
  PENDING: "warning",
  CONFIRMED: "info",
  PROCESSING: "info",
  SHIPPED: "secondary",
  DELIVERED: "success",
  CANCELLED: "danger",
};

const columns: Column<OrderListItem>[] = [
  { key: "orderNumber", header: "Order", sortable: true },
  { key: "status", header: "Status", render: (item) => <Badge variant={statusColors[item.status] || "default"}>{item.status}</Badge> },
  { key: "total", header: "Total", render: (item) => formatCurrency(item.total) },
  { key: "createdAt", header: "Date", render: (item) => formatDate(item.createdAt) },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <PageHeader
            title="Dashboard"
            description="Welcome back! Here's an overview of your account."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard title="Total Orders" value="12" change={8} trend="up" />
            <StatCard title="Total Spent" value="$1,234" change={12} trend="up" />
            <StatCard title="Wishlist Items" value="8" />
            <StatCard title="Reviews" value="5" />
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <a href="/dashboard/orders" className="text-sm text-blue-600 hover:underline">
                  View all
                </a>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={recentOrders}
                columns={columns}
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
