import Stripe from "stripe";
import { db } from "./db";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
  appInfo: {
    name: "E-Commerce Platform",
    version: "1.0.0",
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
});

// ─── Stripe Customer Management ─────────────────────────────────────────

export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  // Check if user already has a Stripe customer ID
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Search for existing customer
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0].id;
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      userId,
    },
  });

  return customer.id;
}

// ─── Checkout Session ───────────────────────────────────────────────────

export async function createCheckoutSession(params: {
  userId: string;
  email: string;
  name?: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  couponCode?: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ sessionId: string; url: string }> {
  const customerId = await getOrCreateStripeCustomer(
    params.userId,
    params.email,
    params.name
  );

  // Create line items
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = params.items.map(
    (item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          metadata: {
            productId: item.productId,
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    })
  );

  // Add shipping as a line item
  lineItems.push({
    price_data: {
      currency: "usd",
      product_data: {
        name: "Shipping",
      },
      unit_amount: 999, // $9.99 shipping
    },
    quantity: 1,
  });

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    billing_address_collection: "required",
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "JP"],
    },
    line_items: lineItems,
    mode: "payment",
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      userId: params.userId,
      couponCode: params.couponCode || "",
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "usd" },
          display_name: "Free Shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 5 },
            maximum: { unit: "business_day", value: 7 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 999, currency: "usd" },
          display_name: "Express Shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 2 },
            maximum: { unit: "business_day", value: 3 },
          },
        },
      },
    ],
    automatic_tax: { enabled: true },
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return {
    sessionId: session.id,
    url: session.url,
  };
}

// ─── Payment Intent ─────────────────────────────────────────────────────

export async function createPaymentIntent(params: {
  amount: number;
  currency?: string;
  customerId?: string;
  metadata?: Record<string, string>;
}): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(params.amount * 100),
    currency: params.currency || "usd",
    customer: params.customerId,
    metadata: params.metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
  };
}

// ─── Refund ─────────────────────────────────────────────────────────────

export async function createRefund(params: {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
}): Promise<Stripe.Refund> {
  const refund = await stripe.refunds.create({
    payment_intent: params.paymentIntentId,
    amount: params.amount ? Math.round(params.amount * 100) : undefined,
    reason: params.reason as Stripe.RefundCreateParams.Reason,
  });

  return refund;
}

// ─── Webhook Handling ───────────────────────────────────────────────────

export async function handleWebhook(
  payload: string | Buffer,
  signature: string
): Promise<void> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    throw new Error("Invalid webhook signature");
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;

    case "payment_intent.succeeded":
      await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;

    case "payment_intent.payment_failed":
      await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
      break;

    case "charge.refunded":
      await handleChargeRefunded(event.data.object as Stripe.Charge);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;

  if (!userId) {
    console.error("No userId in checkout session metadata");
    return;
  }

  // Find or create order
  const order = await db.order.findFirst({
    where: { stripeSessionId: session.id },
  });

  if (order) {
    // Update order with payment info
    await db.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PAID",
        paidAt: new Date(),
        stripePaymentIntentId: session.payment_intent as string,
        status: "CONFIRMED",
        statusHistory: {
          create: {
            status: "CONFIRMED",
            note: "Payment received via Stripe",
          },
        },
      },
    });

    // Update inventory
    const orderItems = await db.orderItem.findMany({
      where: { orderId: order.id },
    });

    for (const item of orderItems) {
      if (item.productId) {
        await db.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    // Clear cart
    await db.cart.deleteMany({
      where: { userId },
    });

    // Send confirmation email
    // await sendOrderConfirmationEmail(order.id);
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment succeeded:", paymentIntent.id);
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment failed:", paymentIntent.id);

  // Find and update order
  const order = await db.order.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (order) {
    await db.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "FAILED",
        statusHistory: {
          create: {
            status: "ON_HOLD",
            note: "Payment failed",
          },
        },
      },
    });
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log("Charge refunded:", charge.id);

  if (charge.payment_intent) {
    const order = await db.order.findFirst({
      where: { stripePaymentIntentId: charge.payment_intent as string },
    });

    if (order) {
      await db.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "REFUNDED",
          status: "REFUNDED",
          statusHistory: {
            create: {
              status: "REFUNDED",
              note: `Refund processed: ${charge.amount_refunded / 100} ${charge.currency.toUpperCase()}`,
            },
          },
        },
      });

      // Create refund record
      await db.refund.create({
        data: {
          orderId: order.id,
          paymentId: order.id,
          amount: charge.amount_refunded / 100,
          status: "COMPLETED",
          stripeRefundId: charge.id,
        },
      });

      // Restore inventory
      const orderItems = await db.orderItem.findMany({
        where: { orderId: order.id },
      });

      for (const item of orderItems) {
        if (item.productId) {
          await db.product.update({
            where: { id: item.productId },
            data: {
              quantity: {
                increment: item.quantity,
              },
            },
          });
        }
      }
    }
  }
}

// ─── Subscription (Future) ──────────────────────────────────────────────

export async function createSubscription(params: {
  customerId: string;
  priceId: string;
  trialDays?: number;
}): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.create({
    customer: params.customerId,
    items: [{ price: params.priceId }],
    trial_period_days: params.trialDays || 7,
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"],
  });

  return subscription;
}

export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.cancel(subscriptionId);
}

// ─── Product Price Management ───────────────────────────────────────────

export async function createStripeProduct(params: {
  name: string;
  description?: string;
  images?: string[];
  metadata?: Record<string, string>;
}): Promise<Stripe.Product> {
  return stripe.products.create({
    name: params.name,
    description: params.description,
    images: params.images,
    metadata: params.metadata,
  });
}

export async function createStripePrice(params: {
  productId: string;
  unitAmount: number;
  currency?: string;
  recurring?: { interval: "month" | "year" };
}): Promise<Stripe.Price> {
  return stripe.prices.create({
    product: params.productId,
    unit_amount: Math.round(params.unitAmount * 100),
    currency: params.currency || "usd",
    recurring: params.recurring,
  });
}
