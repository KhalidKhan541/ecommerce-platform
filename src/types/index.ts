// ─── Core Types ─────────────────────────────────────────────────────────

export type UserRole = "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED"
  | "ON_HOLD";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type PaymentMethod =
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "PAYPAL"
  | "STRIPE"
  | "BANK_TRANSFER"
  | "CASH_ON_DELIVERY";

export type FulfillmentStatus =
  | "UNFULFILLED"
  | "PARTIALLY_FULFILLED"
  | "FULFILLED"
  | "SHIPPED"
  | "DELIVERED";

export type ShipmentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "RETURNED";

export type AddressType = "SHIPPING" | "BILLING";

export type DiscountType = "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";

export type RefundStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

export type NotificationType =
  | "ORDER_UPDATE"
  | "PROMOTION"
  | "SYSTEM"
  | "ACCOUNT"
  | "STOCK_ALERT";

// ─── User Types ─────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  addresses: Address[];
  _count: {
    orders: number;
    reviews: number;
    wishlist: number;
  };
}

export interface UserSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
}

// ─── Product Types ──────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDesc: string | null;
  sku: string;
  price: number;
  comparePrice: number | null;
  costPrice: number | null;
  currency: string;
  taxRate: number;
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  metaTitle: string | null;
  metaDesc: string | null;
  tags: string[];
  brand: string | null;
  vendor: string | null;
  quantity: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string | null;
}

export interface ProductWithDetails extends Product {
  category: Category | null;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews: Review[];
  tagsRelations: ProductTag[];
  _count: {
    reviews: number;
    orderItems: number;
  };
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  comparePrice: number | null;
  isActive: boolean;
  isFeatured: boolean;
  quantity: number;
  createdAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews: { rating: number }[];
  _count: {
    reviews: number;
  };
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  position: number;
  isPrimary: boolean;
  productId: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  comparePrice: number | null;
  quantity: number;
  isActive: boolean;
  options: Record<string, string>;
  productId: string;
}

export interface ProductTag {
  id: string;
  name: string;
  slug: string;
}

// ─── Category Types ─────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  metaTitle: string | null;
  metaDesc: string | null;
  createdAt: Date;
  updatedAt: Date;
  parentId: string | null;
}

export interface CategoryWithChildren extends Category {
  children: CategoryWithCount[];
  parent: Category | null;
  _count: {
    products: number;
  };
}

export interface CategoryWithCount extends Category {
  _count: {
    products: number;
  };
}

// ─── Collection Types ───────────────────────────────────────────────────

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  startsAt: Date | null;
  endsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectionWithProducts extends Collection {
  products: CollectionProduct[];
  categories: CollectionCategory[];
}

export interface CollectionProduct {
  collectionId: string;
  productId: string;
  sortOrder: number;
  product: ProductListItem;
}

export interface CollectionCategory {
  collectionId: string;
  categoryId: string;
  category: Category;
}

// ─── Cart Types ─────────────────────────────────────────────────────────

export interface Cart {
  id: string;
  token: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
}

export interface CartWithItems extends Cart {
  items: CartItemWithDetails[];
  coupon: CouponUsageWithDetails | null;
}

export interface CartItem {
  id: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  cartId: string;
  productId: string;
  variantId: string | null;
}

export interface CartItemWithDetails extends CartItem {
  product: ProductWithImages;
  variant: ProductVariant | null;
}

export interface ProductWithImages extends Product {
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface CartSummary {
  items: CartItemWithDetails[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
}

// ─── Order Types ────────────────────────────────────────────────────────

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  currency: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  total: number;
  notes: string | null;
  internalNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  placedAt: Date | null;
  paidAt: Date | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  cancelledAt: Date | null;
  userId: string;
  shippingAddressId: string | null;
  billingAddressId: string | null;
  stripePaymentIntentId: string | null;
  stripeSessionId: string | null;
}

export interface OrderWithDetails extends Order {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  items: OrderItemWithDetails[];
  shippingAddress: Address | null;
  billingAddress: Address | null;
  payments: Payment[];
  shipments: ShipmentWithItems[];
  statusHistory: OrderStatusHistory[];
  couponUsage: CouponUsageWithDetails | null;
}

export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  taxRate: number;
  taxAmount: number;
  createdAt: Date;
  orderId: string;
  productId: string | null;
  variantId: string | null;
}

export interface OrderItemWithDetails extends OrderItem {
  product: ProductWithImages | null;
  variant: ProductVariant | null;
}

export interface OrderStatusHistory {
  id: string;
  status: OrderStatus;
  note: string | null;
  createdAt: Date;
  orderId: string;
}

export interface OrderListItem {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  createdAt: Date;
  items: {
    name: string;
    quantity: number;
    price: number;
    product: {
      images: ProductImage[];
    } | null;
  }[];
}

// ─── Payment Types ──────────────────────────────────────────────────────

export interface Payment {
  id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  reference: string | null;
  metadata: any | null;
  createdAt: Date;
  updatedAt: Date;
  orderId: string;
  stripePaymentIntentId: string | null;
  stripeChargeId: string | null;
}

export interface Refund {
  id: string;
  amount: number;
  reason: string | null;
  status: RefundStatus;
  reference: string | null;
  createdAt: Date;
  updatedAt: Date;
  orderId: string;
  paymentId: string;
  stripeRefundId: string | null;
}

// ─── Shipping Types ─────────────────────────────────────────────────────

export interface Shipment {
  id: string;
  trackingNumber: string | null;
  carrier: string | null;
  method: string | null;
  status: ShipmentStatus;
  estimatedDelivery: Date | null;
  actualDelivery: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  orderId: string;
}

export interface ShipmentWithItems extends Shipment {
  items: ShipmentItemWithDetails[];
}

export interface ShipmentItem {
  id: string;
  quantity: number;
  shipmentId: string;
  orderItemId: string;
}

export interface ShipmentItemWithDetails extends ShipmentItem {
  orderItem: OrderItem;
}

// ─── Address Types ──────────────────────────────────────────────────────

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company: string | null;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
  type: AddressType;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface AddressFormData {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
  type?: AddressType;
}

// ─── Coupon Types ───────────────────────────────────────────────────────

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: number;
  minimumAmount: number | null;
  maximumDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CouponUsage {
  id: string;
  discount: number;
  couponId: string;
  userId: string;
  orderId: string | null;
  createdAt: Date;
}

export interface CouponUsageWithDetails extends CouponUsage {
  coupon: Coupon;
}

export interface CouponValidation {
  valid: boolean;
  error?: string;
  discount?: number;
  coupon?: Coupon;
}

// ─── Review Types ───────────────────────────────────────────────────────

export interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  productId: string;
}

export interface ReviewWithDetails extends Review {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  images: ReviewImage[];
  helpful: ReviewHelpful | null;
}

export interface ReviewImage {
  id: string;
  url: string;
  alt: string | null;
  reviewId: string;
}

export interface ReviewHelpful {
  id: string;
  helpful: number;
  notHelpful: number;
  reviewId: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// ─── Wishlist Types ─────────────────────────────────────────────────────

export interface WishlistItem {
  id: string;
  createdAt: Date;
  userId: string;
  productId: string;
}

export interface WishlistItemWithProduct extends WishlistItem {
  product: ProductListItem;
}

// ─── Notification Types ─────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  metadata: any | null;
  createdAt: Date;
  userId: string;
}

// ─── Activity Log Types ─────────────────────────────────────────────────

export interface ActivityLog {
  id: string;
  action: string;
  entity: string | null;
  entityId: string | null;
  metadata: any | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  userId: string;
}

// ─── API Response Types ─────────────────────────────────────────────────

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  statusCode: number;
}

// ─── Query Types ────────────────────────────────────────────────────────

export interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  tags?: string[];
  isFeatured?: boolean;
  inStock?: boolean;
}

export interface SearchFilters extends ProductFilters {
  q?: string;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// ─── Admin Analytics Types ──────────────────────────────────────────────

export interface AdminAnalytics {
  overview: {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalProducts: number;
    monthlyOrders: number;
    monthlyRevenue: number;
    revenueGrowth: number;
    orderGrowth: number;
  };
  recentOrders: OrderWithDetails[];
  topProducts: {
    productId: string;
    _sum: {
      quantity: number | null;
      total: number | null;
    };
    _count: number;
  }[];
  ordersByStatus: {
    status: string;
    _count: number;
  }[];
  revenueByDay: {
    date: string;
    revenue: number;
    orders: number;
  }[];
}

// ─── Form Types ─────────────────────────────────────────────────────────

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  saveAddress?: boolean;
  shippingMethod: string;
  paymentMethod: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
}

export interface ProductForm {
  name: string;
  slug?: string;
  description?: string;
  shortDesc?: string;
  sku: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  currency?: string;
  taxRate?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isDigital?: boolean;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  metaTitle?: string;
  metaDesc?: string;
  tags?: string[];
  brand?: string;
  vendor?: string;
  quantity?: number;
  lowStockThreshold?: number;
  trackInventory?: boolean;
  allowBackorder?: boolean;
  categoryId?: string;
}

// ─── Cart Store Types ───────────────────────────────────────────────────

export interface CartStore {
  items: CartItemWithDetails[];
  isLoading: boolean;
  addItem: (productId: string, quantity?: number, variantId?: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  getCart: () => Promise<void>;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getShipping: () => number;
  getDiscount: () => number;
  getTotal: () => number;
}

// ─── UI Component Types ─────────────────────────────────────────────────

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning";
}

// ─── Stripe Types ───────────────────────────────────────────────────────

export interface StripeCheckoutSession {
  sessionId: string;
  url: string;
}

export interface StripePaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

// ─── Event Types ────────────────────────────────────────────────────────

export interface ProductEvent {
  type: "created" | "updated" | "deleted" | "stock_changed";
  productId: string;
  data?: Partial<Product>;
}

export interface OrderEvent {
  type: "created" | "updated" | "status_changed" | "payment_received";
  orderId: string;
  data?: Partial<Order>;
}
