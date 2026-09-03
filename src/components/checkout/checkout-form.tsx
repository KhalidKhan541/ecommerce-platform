"use client";

import React, { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import { Thumbnail } from "@/components/ui/image";
import type { CartItemWithDetails, CartSummary } from "@/types";

interface CheckoutFormProps {
  items: CartItemWithDetails[];
  summary: CartSummary;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  className?: string;
}

const shippingMethods = [
  { value: "standard", label: "Standard Shipping (5-7 days) - Free" },
  { value: "express", label: "Express Shipping (2-3 days) - $9.99" },
  { value: "overnight", label: "Overnight Shipping (1 day) - $19.99" },
];

const countries = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
];

function CheckoutForm({ items, summary, onSubmit, isLoading, className }: CheckoutFormProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    shippingMethod: "standard",
    paymentMethod: "credit_card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    saveAddress: false,
  });

  const updateForm = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-8", className)}>
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {["Shipping", "Payment", "Review"].map((label, i) => (
          <React.Fragment key={label}>
            {i > 0 && <div className="h-px w-12 bg-gray-200" />}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                  step > i + 1
                    ? "bg-emerald-500 text-white"
                    : step === i + 1
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {step > i + 1 ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={cn("text-sm font-medium", step === i + 1 ? "text-gray-900" : "text-gray-500")}>
                {label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    placeholder="john@example.com"
                  />
                  <Input
                    label="Phone (optional)"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateForm("phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="First Name"
                      required
                      value={form.firstName}
                      onChange={(e) => updateForm("firstName", e.target.value)}
                    />
                    <Input
                      label="Last Name"
                      required
                      value={form.lastName}
                      onChange={(e) => updateForm("lastName", e.target.value)}
                    />
                  </div>
                  <Input
                    label="Address"
                    required
                    value={form.address1}
                    onChange={(e) => updateForm("address1", e.target.value)}
                    placeholder="Street address"
                  />
                  <Input
                    label="Apartment, suite, etc. (optional)"
                    value={form.address2}
                    onChange={(e) => updateForm("address2", e.target.value)}
                  />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Input
                      label="City"
                      required
                      value={form.city}
                      onChange={(e) => updateForm("city", e.target.value)}
                    />
                    <Input
                      label="State"
                      required
                      value={form.state}
                      onChange={(e) => updateForm("state", e.target.value)}
                    />
                    <Input
                      label="ZIP Code"
                      required
                      value={form.postalCode}
                      onChange={(e) => updateForm("postalCode", e.target.value)}
                    />
                  </div>
                  <Select
                    label="Country"
                    options={countries}
                    value={form.country}
                    onChange={(e) => updateForm("country", e.target.value)}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="button" size="lg" onClick={() => setStep(2)}>
                  Continue to Payment
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shipping Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {shippingMethods.map((method) => (
                    <label
                      key={method.value}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors",
                        form.shippingMethod === method.value
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method.value}
                        checked={form.shippingMethod === method.value}
                        onChange={(e) => updateForm("shippingMethod", e.target.value)}
                        className="h-4 w-4 text-gray-900"
                      />
                      <span className="text-sm">{method.label}</span>
                    </label>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Card Number"
                    required
                    value={form.cardNumber}
                    onChange={(e) => updateForm("cardNumber", e.target.value)}
                    placeholder="1234 5678 9012 3456"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Expiry Date"
                      required
                      value={form.cardExpiry}
                      onChange={(e) => updateForm("cardExpiry", e.target.value)}
                      placeholder="MM/YY"
                    />
                    <Input
                      label="CVC"
                      required
                      value={form.cardCvc}
                      onChange={(e) => updateForm("cardCvc", e.target.value)}
                      placeholder="123"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="button" size="lg" onClick={() => setStep(3)}>
                  Review Order
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-900">Shipping to:</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {form.firstName} {form.lastName}
                      <br />
                      {form.address1}
                      {form.address2 && <>, {form.address2}</>}
                      <br />
                      {form.city}, {form.state} {form.postalCode}
                      <br />
                      {countries.find((c) => c.value === form.country)?.label}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-900">Payment method:</p>
                    <p className="mt-1 text-sm text-gray-600">
                      Card ending in {form.cardNumber.slice(-4)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button type="button" variant="outline" size="lg" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? "Processing..." : `Pay ${formatCurrency(summary.total)}`}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => {
                const product = item.product;
                const variant = item.variant;
                const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
                const price = variant?.price || product.price;
                const lineTotal = price * item.quantity;

                return (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative">
                      <Thumbnail
                        src={primaryImage?.url || "/images/placeholder.png"}
                        alt={product.name}
                        size="sm"
                      />
                      <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                        {item.quantity}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                      {variant && <p className="text-xs text-gray-500">{variant.name}</p>}
                    </div>
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(lineTotal)}</p>
                  </div>
                );
              })}

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatCurrency(summary.subtotal)}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Discount</span>
                    <span className="font-medium text-emerald-600">-{formatCurrency(summary.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-medium">{formatCurrency(summary.tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">
                    {summary.shipping === 0 ? "Free" : formatCurrency(summary.shipping)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-base font-bold">{formatCurrency(summary.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

export { CheckoutForm };
