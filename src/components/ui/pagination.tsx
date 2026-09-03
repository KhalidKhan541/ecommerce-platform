"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  href?: (page: number) => string;
  className?: string;
  showFirstLast?: boolean;
  siblingCount?: number;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  href,
  className,
  showFirstLast = true,
  siblingCount = 1,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    if (showLeftDots) {
      pages.push(1);
      if (leftSibling > 3) {
        pages.push("...");
      }
    }

    for (let i = leftSibling; i <= rightSibling; i++) {
      pages.push(i);
    }

    if (showRightDots) {
      if (rightSibling < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  if (totalPages <= 1) return null;

  const renderPageButton = (page: number | "...", index: number) => {
    if (page === "...") {
      return (
        <span
          key={`dots-${index}`}
          className="flex h-10 w-10 items-center justify-center text-sm text-gray-500"
        >
          ...
        </span>
      );
    }

    const isActive = page === currentPage;
    const buttonContent = (
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors",
          isActive
            ? "bg-gray-900 text-white"
            : "text-gray-700 hover:bg-gray-100",
          !isActive && "cursor-pointer"
        )}
      >
        {page}
      </span>
    );

    if (href) {
      return (
        <Link key={page} href={href(page)} className="block">
          {buttonContent}
        </Link>
      );
    }

    return (
      <button
        key={page}
        type="button"
        onClick={() => onPageChange?.(page)}
        disabled={isActive}
      >
        {buttonContent}
      </button>
    );
  };

  return (
    <nav className={cn("flex items-center gap-1", className)} aria-label="Pagination">
      {showFirstLast && (
        <button
          type="button"
          onClick={() => onPageChange?.(1)}
          disabled={currentPage === 1}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      )}

      <button
        type="button"
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map((page, index) => renderPageButton(page, index))}

      <button
        type="button"
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {showFirstLast && (
        <button
          type="button"
          onClick={() => onPageChange?.(totalPages)}
          disabled={currentPage === totalPages}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </nav>
  );
}

// ─── Simple Pagination ──────────────────────────────────────────────────

interface SimplePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function SimplePagination({ page, totalPages, onPageChange }: SimplePaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>
      <span className="text-sm text-gray-700">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Next
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

export { Pagination, SimplePagination };
