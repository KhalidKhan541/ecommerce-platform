"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Select, Checkbox } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductFiltersProps {
  categories: { id: string; name: string; slug: string; _count: { products: number } }[];
  className?: string;
}

function ProductFilters({ categories, className }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("minPrice") || "",
    max: searchParams.get("maxPrice") || "",
  });
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("categoryId") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");
  const [inStock, setInStock] = useState(searchParams.get("inStock") === "true");

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedCategory) params.set("categoryId", selectedCategory);
    else params.delete("categoryId");
    if (priceRange.min) params.set("minPrice", priceRange.min);
    else params.delete("minPrice");
    if (priceRange.max) params.set("maxPrice", priceRange.max);
    else params.delete("maxPrice");
    if (sortBy) params.set("sortBy", sortBy);
    if (inStock) params.set("inStock", "true");
    else params.delete("inStock");
    params.set("page", "1");
    router.push(`/shop?${params.toString()}`);
  };

  const clearFilters = () => {
    setPriceRange({ min: "", max: "" });
    setSelectedCategory("");
    setSortBy("newest");
    setInStock(false);
    router.push("/shop");
  };

  const hasActiveFilters = selectedCategory || priceRange.min || priceRange.max || inStock;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Sort */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sort By</CardTitle>
        </CardHeader>
        <div className="px-6 pb-6">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: "newest", label: "Newest" },
              { value: "price_asc", label: "Price: Low to High" },
              { value: "price_desc", label: "Price: High to Low" },
              { value: "rating", label: "Best Rating" },
              { value: "bestselling", label: "Best Selling" },
            ]}
          />
        </div>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <div className="space-y-2 px-6 pb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                setSelectedCategory(selectedCategory === category.id ? "" : category.id)
              }
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                selectedCategory === category.id
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <span>{category.name}</span>
              <span className="text-xs text-gray-400">({category._count.products})</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <div className="space-y-4 px-6 pb-6">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              className="w-full"
            />
            <span className="text-gray-400">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* In Stock */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Availability</CardTitle>
        </CardHeader>
        <div className="px-6 pb-6">
          <Checkbox
            label="In Stock Only"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
        {hasActiveFilters && (
          <Button onClick={clearFilters} variant="outline">
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

export { ProductFilters };
