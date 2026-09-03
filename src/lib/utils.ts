import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── Utility Classes ────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── String Utilities ───────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function camelCase(text: string): string {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/[\s\-_]+/g, "");
}

export function snakeCase(text: string): string {
  return text
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");
}

export function kebabCase(text: string): string {
  return snakeCase(text).replace(/_/g, "-");
}

// ─── Number Utilities ───────────────────────────────────────────────────

export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatNumber(
  num: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat("en-US", options).format(num);
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(num);
}

export function roundToTwoDecimals(num: number): number {
  return Math.round(num * 100) / 100;
}

export function calculateDiscount(
  price: number,
  comparePrice: number
): number {
  if (comparePrice <= 0) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

// ─── Date Utilities ─────────────────────────────────────────────────────

import {
  format,
  formatDistanceToNow,
  parseISO,
  isValid,
  isAfter,
  isBefore,
  addDays,
  subDays,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  differenceInDays,
  differenceInHours,
} from "date-fns";

export function formatDate(
  date: Date | string,
  formatStr: string = "MMM dd, yyyy"
): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "Invalid date";
  return format(d, formatStr);
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "Invalid date";
  return formatDistanceToNow(d, { addSuffix: true });
}

export function isDateAfter(date: Date | string, comparison: Date | string): boolean {
  const d1 = typeof date === "string" ? parseISO(date) : date;
  const d2 = typeof comparison === "string" ? parseISO(comparison) : comparison;
  return isAfter(d1, d2);
}

export function isDateBefore(date: Date | string, comparison: Date | string): boolean {
  const d1 = typeof date === "string" ? parseISO(date) : date;
  const d2 = typeof comparison === "string" ? parseISO(comparison) : comparison;
  return isBefore(d1, d2);
}

export function getDaysBetween(start: Date | string, end: Date | string): number {
  const d1 = typeof start === "string" ? parseISO(start) : start;
  const d2 = typeof end === "string" ? parseISO(end) : end;
  return differenceInDays(d1, d2);
}

export function getHoursBetween(start: Date | string, end: Date | string): number {
  const d1 = typeof start === "string" ? parseISO(start) : start;
  const d2 = typeof end === "string" ? parseISO(end) : end;
  return differenceInHours(d1, d2);
}

export function isExpired(date: Date | string): boolean {
  const d = typeof date === "string" ? parseISO(date) : date;
  return isBefore(d, new Date());
}

export function isValidDateRange(
  start: Date | string,
  end: Date | string
): boolean {
  const d1 = typeof start === "string" ? parseISO(start) : start;
  const d2 = typeof end === "string" ? parseISO(end) : end;
  return isBefore(d1, d2);
}

// ─── Array Utilities ────────────────────────────────────────────────────

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function groupBy<T>(
  array: T[],
  key: keyof T | ((item: T) => string)
): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = typeof key === "function" ? key(item) : String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export function sortBy<T>(
  array: T[],
  key: keyof T,
  order: "asc" | "desc" = "asc"
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function flatten<T>(array: T[][]): T[] {
  return array.reduce((result, item) => result.concat(item), []);
}

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}

// ─── Validation Utilities ───────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s\-()]{7,}$/.test(phone);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function isValidPostalCode(code: string, country: string = "US"): boolean {
  const patterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
    JP: /^\d{3}-?\d{4}$/,
  };

  const pattern = patterns[country];
  return pattern ? pattern.test(code) : /^\w{3,10}$/.test(code);
}

// ─── Price Utilities ────────────────────────────────────────────────────

export function calculateTax(
  amount: number,
  taxRate: number
): number {
  return roundToTwoDecimals(amount * (taxRate / 100));
}

export function calculateShipping(
  subtotal: number,
  shippingRules?: {
    freeShippingThreshold?: number;
    flatRate?: number;
  }
): number {
  const { freeShippingThreshold = 50, flatRate = 9.99 } = shippingRules || {};
  return subtotal >= freeShippingThreshold ? 0 : flatRate;
}

export function calculateDiscountAmount(
  subtotal: number,
  discountType: "PERCENTAGE" | "FIXED",
  discountValue: number,
  maximumDiscount?: number
): number {
  let discount = 0;

  if (discountType === "PERCENTAGE") {
    discount = roundToTwoDecimals(subtotal * (discountValue / 100));
  } else {
    discount = discountValue;
  }

  if (maximumDiscount && discount > maximumDiscount) {
    discount = maximumDiscount;
  }

  return Math.min(discount, subtotal);
}

export function calculateTotal(params: {
  subtotal: number;
  taxRate?: number;
  discountAmount?: number;
  shippingCost?: number;
}): number {
  const {
    subtotal,
    taxRate = 0,
    discountAmount = 0,
    shippingCost = 0,
  } = params;

  const tax = calculateTax(subtotal - discountAmount, taxRate);
  return roundToTwoDecimals(subtotal - discountAmount + tax + shippingCost);
}

// ─── Image Utilities ────────────────────────────────────────────────────

export function getImageUrl(
  path: string,
  width?: number,
  height?: number
): string {
  if (path.startsWith("http")) return path;

  const params = new URLSearchParams();
  if (width) params.set("w", width.toString());
  if (height) params.set("h", height.toString());

  const query = params.toString();
  return `/api/images/${path}${query ? `?${query}` : ""}`;
}

export function getPlaceholderImage(width: number, height: number): string {
  return `data:image/svg+xml;base64,${btoa(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="sans-serif" font-size="14">
        No Image
      </text>
    </svg>`
  )}`;
}

// ─── SEO Utilities ──────────────────────────────────────────────────────

export function generateMetaTitle(title: string, siteName: string = "Shop"): string {
  const maxLength = 60;
  const fullTitle = `${title} | ${siteName}`;
  if (fullTitle.length <= maxLength) return fullTitle;
  return `${title.slice(0, maxLength - siteName.length - 4)}... | ${siteName}`;
}

export function generateMetaDescription(description: string): string {
  const maxLength = 160;
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength - 3) + "...";
}

export function generateStructuredData(type: string, data: Record<string, any>) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };
}

// ─── Debounce & Throttle ────────────────────────────────────────────────

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

// ─── Misc Utilities ─────────────────────────────────────────────────────

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export function generateSKU(prefix: string = "SKU"): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceVal = source[key];
      const targetVal = result[key];
      if (
        typeof sourceVal === "object" &&
        sourceVal !== null &&
        !Array.isArray(sourceVal) &&
        typeof targetVal === "object" &&
        targetVal !== null
      ) {
        (result as any)[key] = deepMerge(targetVal as any, sourceVal as any);
      } else {
        (result as any)[key] = sourceVal;
      }
    }
  }
  return result;
}

export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function highlightText(text: string, query: string): string {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  return Promise.resolve();
}

export function downloadFile(url: string, filename: string): void {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function scrollToTop(smooth: boolean = true): void {
  window.scrollTo({
    top: 0,
    behavior: smooth ? "smooth" : "instant",
  });
}

export function scrollToElement(
  elementId: string,
  smooth: boolean = true
): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: smooth ? "smooth" : "instant",
      block: "start",
    });
  }
}
