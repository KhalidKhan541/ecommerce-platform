"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { AdminSidebar } from "@/components/layout/sidebar";
import { PageHeader } from "@/components/layout/navigation";
import { StatCard, Badge } from "@/components/ui/card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, Column } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { OrderListItem } from "@/types";

const orders: OrderListItem[] = [
  { id: "1", orderNumber: "ORD-001", status: "SHIPPED", paymentStatus: "PAID", total: 149.99, createdAt: new Date(), items: [{ name: "Wireless Headphones", quantity: 1, price: 149.99, product: { images: [] } }] },
  { id: "2", orderNumber: "ORD-002", status: "PENDING", paymentStatus: "PAID", total: 79.98, createdAt: new Date(), items: [{ name: "Cotton T-Shirt", quantity: 2, price: 29.99, product: { images: [] } }] },
  { id: "3", orderNumber: "ORD-003", status: "DELIVERED", paymentStatus: "PAID", total: 249.99, createdAt: new Date(), items: [{ name: "Smart Watch", quantity: 1, price: 249.99, product: { images: [] } }] },
  { id: "4", orderNumber: "ORD-004", status: "PROCESSING", paymentStatus: "PAID", total: 89.97, createdAt: new Date(), items: [{ name: "Fitness Band", quantity: 1, price: 39.99, product: { images: [] } }] },
  { id: "5", orderNumber: "ORD-005", status: "CANCELLED", paymentStatus: "REFUNDED", total: 199.99, createdAt: new Date(), items: [{ name: "Gaming Mouse", quantity: 1, price: 199.99, product: { images: [] } }] },
];

const statusColors: Record<string, "success" | "warning" | "info" | "danger" | "secondary"> = {
  PENDING: "warning",
  CONFIRMED: "info",
  PROCESSING: "info",
  SHIPPED: "secondary",
  DELIVERED: "success",
  CANCELLED: "danger",
  ON_HOLD: "warning",
};

const columns: Column<OrderListItem>[] = [
  { key: "orderNumber", header: "Order #", sortable: true },
  { key: "status", header: "Status", render: (item) => <Badge variant={statusColors[item.status] || "default"}>{item.status}</Badge> },
  { key: "total", header: "Total", render: (item) => formatCurrency(item.total) },
  { key: "createdAt", header: "Date", render: (item) => formatDate(item.createdAt) },
  { key: "id", header: "Actions", render: () => <Button variant="ghost" size="sm">View</Button> },
];

export default function AdminOrdersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <PageHeader
            title="Orders"
            description="Manage customer orders"
            action={<Button>Export Orders</Button>}
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard title="Total Orders" value="156" change={12} trend="up" />
            <StatCard title="Pending" value="12" />
            <StatCard title="Shipped" value="89" change={8} trend="up" />
            <StatCard title="Revenue" value="$24,589" change={15} trend="up" />
          </div>

          <Card>
            <CardContent className="pt-6">
              <DataTable
                data={orders}
                columns={columns}
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
