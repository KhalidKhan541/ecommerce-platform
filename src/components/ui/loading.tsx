"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ─── Skeleton ───────────────────────────────────────────────────────────

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

function Skeleton({
  className,
  variant = "text",
  width,
  height,
  ...props
}: SkeletonProps) {
  const variants: Record<string, string> = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={cn("animate-pulse bg-gray-200", variants[variant], className)}
      style={{ width, height }}
      {...props}
    />
  );
}

// ─── Spinner ────────────────────────────────────────────────────────────

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
}

function Spinner({ className, size = "md", color }: SpinnerProps) {
  const sizes: Record<string, string> = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  return (
    <div className={cn("animate-spin", sizes[size], className)} role="status">
      <svg
        className="h-full w-full"
        viewBox="0 0 24 24"
        fill="none"
        style={color ? { color } : undefined}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// ─── Progress ───────────────────────────────────────────────────────────

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: "default" | "success" | "warning" | "danger";
  showValue?: boolean;
}

function Progress({
  className,
  value,
  max = 100,
  size = "md",
  color = "default",
  showValue = false,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes: Record<string, string> = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colors: Record<string, string> = {
    default: "bg-blue-600",
    success: "bg-emerald-600",
    warning: "bg-amber-500",
    danger: "bg-red-600",
  };

  return (
    <div className="w-full" {...props}>
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-gray-200",
          sizes[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-in-out",
            colors[color]
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showValue && (
        <p className="mt-1 text-sm text-gray-500">
          {value} / {max}
        </p>
      )}
    </div>
  );
}

// ─── Loading Page ───────────────────────────────────────────────────────

function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Spinner size="xl" />
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

// ─── Loading Overlay ────────────────────────────────────────────────────

function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <Spinner size="lg" />
    </div>
  );
}

// ─── Inline Loader ──────────────────────────────────────────────────────

function InlineLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <Spinner size="sm" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

// ─── Table Skeleton ─────────────────────────────────────────────────────

function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Card Skeleton ──────────────────────────────────────────────────────

function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-200 p-4">
          <Skeleton className="mb-4 h-48 w-full rounded-lg" variant="rectangular" />
          <Skeleton className="mb-2 h-4 w-3/4" />
          <Skeleton className="mb-2 h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export {
  Skeleton,
  Spinner,
  Progress,
  LoadingPage,
  LoadingOverlay,
  InlineLoader,
  TableSkeleton,
  CardSkeleton,
};
