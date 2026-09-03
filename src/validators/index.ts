import { z } from "zod";

// ─── Auth Validators ────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── Product Validators ─────────────────────────────────────────────────

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name must be less than 200 characters"),
  slug: z.string().optional(),
  description: z.string().optional(),
  shortDesc: z.string().max(500, "Short description must be less than 500 characters").optional(),
  sku: z.string().min(1, "SKU is required").max(50, "SKU must be less than 50 characters"),
  price: z.number().min(0.01, "Price must be greater than 0").max(999999.99, "Price is too high"),
  comparePrice: z.number().min(0, "Compare price must be positive").optional(),
  costPrice: z.number().min(0, "Cost price must be positive").optional(),
  currency: z.string().default("USD"),
  taxRate: z.number().min(0).max(100).default(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isDigital: z.boolean().default(false),
  weight: z.number().min(0).optional(),
  length: z.number().min(0).optional(),
  width: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  metaTitle: z.string().max(60, "Meta title must be less than 60 characters").optional(),
  metaDesc: z.string().max(160, "Meta description must be less than 160 characters").optional(),
  tags: z.array(z.string()).optional(),
  brand: z.string().max(100).optional(),
  vendor: z.string().max(100).optional(),
  quantity: z.number().min(0).default(0),
  lowStockThreshold: z.number().min(0).default(5),
  trackInventory: z.boolean().default(true),
  allowBackorder: z.boolean().default(false),
  categoryId: z.string().optional(),
});

export const productVariantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  comparePrice: z.number().min(0).optional(),
  quantity: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
  options: z.record(z.string()).default({}),
});

// ─── Category Validators ────────────────────────────────────────────────

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name must be less than 100 characters"),
  slug: z.string().optional(),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  image: z.string().url("Please enter a valid URL").optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().min(0).default(0),
  metaTitle: z.string().max(60).optional(),
  metaDesc: z.string().max(160).optional(),
  parentId: z.string().optional(),
});

// ─── Order Validators ───────────────────────────────────────────────────

export const orderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
    "ON_HOLD",
  ]),
  note: z.string().max(500).optional(),
});

export const shippingAddressSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  company: z.string().max(100).optional(),
  address1: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address must be less than 200 characters"),
  address2: z.string().max(200).optional(),
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City must be less than 100 characters"),
  state: z
    .string()
    .min(1, "State is required")
    .max(100, "State must be less than 100 characters"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .max(20, "Postal code must be less than 20 characters"),
  country: z.string().min(1, "Country is required").default("US"),
  phone: z.string().max(20).optional(),
  isDefault: z.boolean().default(false),
  type: z.enum(["SHIPPING", "BILLING"]).default("SHIPPING"),
});

export const addressSchema = shippingAddressSchema;

// ─── Coupon Validators ──────────────────────────────────────────────────

export const couponSchema = z
  .object({
    code: z
      .string()
      .min(1, "Coupon code is required")
      .max(50, "Coupon code must be less than 50 characters")
      .transform((val) => val.toUpperCase()),
    description: z.string().max(500).optional(),
    discountType: z.enum(["PERCENTAGE", "FIXED", "FREE_SHIPPING"]),
    discountValue: z.number().min(0.01, "Discount value must be greater than 0"),
    minimumAmount: z.number().min(0).optional(),
    maximumDiscount: z.number().min(0).optional(),
    usageLimit: z.number().min(1).optional(),
    isActive: z.boolean().default(true),
    startsAt: z.string().datetime().optional(),
    endsAt: z.string().datetime().optional(),
  })
  .refine(
    (data) => {
      if (data.discountType === "PERCENTAGE" && data.discountValue > 100) {
        return false;
      }
      return true;
    },
    {
      message: "Percentage discount cannot exceed 100%",
      path: ["discountValue"],
    }
  )
  .refine(
    (data) => {
      if (data.startsAt && data.endsAt) {
        return new Date(data.startsAt) < new Date(data.endsAt);
      }
      return true;
    },
    {
      message: "Start date must be before end date",
      path: ["endsAt"],
    }
  );

// ─── Review Validators ──────────────────────────────────────────────────

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating is required")
    .max(5, "Rating must be between 1 and 5"),
  title: z
    .string()
    .max(100, "Title must be less than 100 characters")
    .optional(),
  comment: z
    .string()
    .max(2000, "Comment must be less than 2000 characters")
    .optional(),
});

// ─── Checkout Validators ────────────────────────────────────────────────

export const checkoutSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  address1: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address must be less than 200 characters"),
  address2: z.string().max(200).optional(),
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City must be less than 100 characters"),
  state: z
    .string()
    .min(1, "State is required")
    .max(100, "State must be less than 100 characters"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .max(20, "Postal code must be less than 20 characters"),
  country: z.string().min(1, "Country is required").default("US"),
  phone: z.string().max(20).optional(),
  saveAddress: z.boolean().default(false),
  shippingMethod: z.string().min(1, "Please select a shipping method"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
  couponCode: z.string().optional(),
});

// ─── Search Validators ──────────────────────────────────────────────────

export const searchSchema = z.object({
  q: z.string().min(1, "Search query is required").max(200),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12),
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  sortBy: z.enum(["relevance", "price_asc", "price_desc", "newest", "rating"]).default("relevance"),
});

// ─── User Profile Validators ────────────────────────────────────────────

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z.string().max(20).optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── Admin Validators ───────────────────────────────────────────────────

export const adminUserSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  role: z.enum(["CUSTOMER", "ADMIN", "SUPER_ADMIN"]).optional(),
  isActive: z.boolean().optional(),
});

export const bulkActionSchema = z.object({
  action: z.enum(["delete", "activate", "deactivate"]),
  ids: z.array(z.string()).min(1, "Please select at least one item"),
});

// ─── Pagination Validators ──────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12),
});

// ─── Newsletter Validators ──────────────────────────────────────────────

export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

// ─── Contact Form Validators ────────────────────────────────────────────

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject must be less than 200 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(5000, "Message must be less than 5000 characters"),
});

// ─── Type Exports ───────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type OrderStatusInput = z.infer<typeof orderStatusSchema>;
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type AdminUserInput = z.infer<typeof adminUserSchema>;
export type BulkActionInput = z.infer<typeof bulkActionSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
