import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const db = globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

// ─── Database Helper Functions ──────────────────────────────────────────

export async function findUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      addresses: true,
      _count: {
        select: {
          orders: true,
          reviews: true,
          wishlist: true,
        },
      },
    },
  });
}

export async function findUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    include: {
      addresses: {
        orderBy: { isDefault: "desc" },
      },
      _count: {
        select: {
          orders: true,
          reviews: true,
          wishlist: true,
        },
      },
    },
  });
}

export async function createUser(data: {
  email: string;
  name?: string;
  password?: string;
  image?: string;
  role?: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
}) {
  return db.user.create({
    data: {
      email: data.email.toLowerCase(),
      name: data.name,
      password: data.password,
      image: data.image,
      role: data.role || "CUSTOMER",
    },
  });
}

export async function findProductBySlug(slug: string) {
  return db.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: {
        orderBy: { position: "asc" },
      },
      variants: {
        where: { isActive: true },
        orderBy: { price: "asc" },
      },
      reviews: {
        where: { isApproved: true },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
          images: true,
          helpful: true,
        },
        orderBy: { createdAt: "desc" },
      },
      tagsRelations: true,
      _count: {
        select: {
          reviews: true,
          orderItems: true,
        },
      },
    },
  });
}

export async function findProducts(params: {
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
}) {
  const {
    page = 1,
    limit = 12,
    categoryId,
    search,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc",
    tags,
    isFeatured,
    inStock,
  } = params;

  const skip = (page - 1) * limit;

  const where: any = {
    isActive: true,
  };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
      { tags: { has: search } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (tags && tags.length > 0) {
    where.tagsRelations = {
      some: {
        name: { in: tags },
      },
    };
  }

  if (isFeatured !== undefined) {
    where.isFeatured = isFeatured;
  }

  if (inStock) {
    where.quantity = { gt: 0 };
  }

  const orderBy: any = {};
  if (sortBy === "price") {
    orderBy.price = sortOrder;
  } else if (sortBy === "name") {
    orderBy.name = sortOrder;
  } else if (sortBy === "rating") {
    orderBy.reviews = { _count: sortOrder };
  } else {
    orderBy.createdAt = sortOrder;
  }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        variants: {
          where: { isActive: true },
          orderBy: { price: "asc" },
          take: 1,
        },
        reviews: {
          where: { isApproved: true },
          select: { rating: true },
        },
        _count: {
          select: { reviews: true },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    db.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}

export async function findCategories(parentId?: string | null) {
  return db.category.findMany({
    where: {
      isActive: true,
      parentId: parentId || null,
    },
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function findCategoryBySlug(slug: string) {
  return db.category.findUnique({
    where: { slug },
    include: {
      children: {
        where: { isActive: true },
        include: {
          _count: { select: { products: true } },
        },
      },
      parent: true,
      _count: { select: { products: true } },
    },
  });
}

export async function getCart(userId?: string, token?: string) {
  const where = userId ? { userId } : { token };

  return db.cart.findFirst({
    where,
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
              },
              variants: true,
            },
          },
          variant: true,
        },
      },
      coupon: {
        include: { coupon: true },
      },
    },
  });
}

export async function createOrder(data: {
  userId: string;
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
  }>;
  shippingAddressId: string;
  billingAddressId?: string;
  couponCode?: string;
  notes?: string;
}) {
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  let subtotal = 0;
  let taxAmount = 0;
  let discountAmount = 0;

  const orderItems = data.items.map((item) => {
    const itemTotal = item.price * item.quantity;
    const tax = itemTotal * 0.1; // 10% tax
    subtotal += itemTotal;
    taxAmount += tax;

    return {
      name: `Product ${item.productId}`,
      sku: `SKU-${item.productId}`,
      price: item.price,
      quantity: item.quantity,
      total: itemTotal,
      taxRate: 0.1,
      taxAmount: tax,
      productId: item.productId,
      variantId: item.variantId,
    };
  });

  if (data.couponCode) {
    const coupon = await db.coupon.findUnique({
      where: { code: data.couponCode },
    });

    if (coupon && coupon.isActive) {
      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = (subtotal * Number(coupon.discountValue)) / 100;
        if (coupon.maximumDiscount && discountAmount > Number(coupon.maximumDiscount)) {
          discountAmount = Number(coupon.maximumDiscount);
        }
      } else if (coupon.discountType === "FIXED") {
        discountAmount = Number(coupon.discountValue);
      }
    }
  }

  const total = subtotal + taxAmount - discountAmount;

  return db.order.create({
    data: {
      orderNumber,
      userId: data.userId,
      subtotal,
      taxAmount,
      discountAmount,
      total,
      notes: data.notes,
      shippingAddressId: data.shippingAddressId,
      billingAddressId: data.billingAddressId || data.shippingAddressId,
      items: {
        create: orderItems,
      },
      statusHistory: {
        create: { status: "PENDING", note: "Order created" },
      },
    },
    include: {
      items: true,
      statusHistory: true,
    },
  });
}

export async function getOrderById(orderId: string, userId?: string) {
  const where: any = { id: orderId };
  if (userId) where.userId = userId;

  return db.order.findFirst({
    where,
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
          variant: true,
        },
      },
      shippingAddress: true,
      billingAddress: true,
      payments: true,
      shipments: {
        include: {
          items: {
            include: {
              orderItem: true,
            },
          },
        },
      },
      statusHistory: {
        orderBy: { createdAt: "desc" },
      },
      couponUsage: {
        include: { coupon: true },
      },
    },
  });
}

export async function getUserOrders(userId: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
        statusHistory: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.order.count({ where: { userId } }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getAdminAnalytics() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalOrders,
    totalRevenue,
    totalCustomers,
    totalProducts,
    monthlyOrders,
    monthlyRevenue,
    lastMonthOrders,
    lastMonthRevenue,
    recentOrders,
    topProducts,
    ordersByStatus,
    revenueByDay,
  ] = await Promise.all([
    db.order.count(),
    db.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.product.count(),
    db.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: startOfMonth }, paymentStatus: "PAID" } }),
    db.order.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
    db.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }, paymentStatus: "PAID" } }),
    db.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    db.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true, total: true },
      _count: true,
      orderBy: { _sum: { total: "desc" } },
      take: 10,
    }),
    db.order.groupBy({
      by: ["status"],
      _count: true,
    }),
    db.$queryRaw`
      SELECT DATE(created_at) as date, SUM(total) as revenue, COUNT(*) as orders
      FROM orders
      WHERE created_at >= ${new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)}
        AND payment_status = 'PAID'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
  ]);

  return {
    overview: {
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      totalCustomers,
      totalProducts,
      monthlyOrders,
      monthlyRevenue: monthlyRevenue._sum.total || 0,
      revenueGrowth: lastMonthRevenue._sum.total
        ? ((Number(monthlyRevenue._sum.total) - Number(lastMonthRevenue._sum.total)) / Number(lastMonthRevenue._sum.total)) * 100
        : 0,
      orderGrowth: lastMonthOrders
        ? ((monthlyOrders - lastMonthOrders) / lastMonthOrders) * 100
        : 0,
    },
    recentOrders,
    topProducts,
    ordersByStatus,
    revenueByDay,
  };
}
