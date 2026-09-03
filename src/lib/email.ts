import nodemailer from "nodemailer";

// ─── Email Configuration ────────────────────────────────────────────────

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

function getEmailConfig(): EmailConfig {
  return {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  };
}

async function createTransporter() {
  const config = getEmailConfig();
  return nodemailer.createTransport(config);
}

// ─── Email Templates ────────────────────────────────────────────────────

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

function getBaseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
    .header { background-color: #4f46e5; color: #ffffff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px 20px; }
    .footer { background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
    .button:hover { background-color: #4338ca; }
    .order-item { border-bottom: 1px solid #e2e8f0; padding: 15px 0; }
    .order-item:last-child { border-bottom: none; }
    .text-center { text-align: center; }
    .text-muted { color: #64748b; }
    .mt-4 { margin-top: 1rem; }
    .mb-4 { margin-bottom: 1rem; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${process.env.NEXT_PUBLIC_APP_NAME || "Shop"}</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p class="text-muted">© ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_APP_NAME || "Shop"}. All rights reserved.</p>
      <p class="text-muted">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe">Unsubscribe</a> | 
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ─── Welcome Email ───────────────────────────────────────────────────────

export async function sendWelcomeEmail(params: {
  to: string;
  name: string;
}): Promise<void> {
  const template: EmailTemplate = {
    subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || "Shop"}!`,
    html: getBaseTemplate(`
      <h2>Welcome, ${params.name}!</h2>
      <p>Thank you for creating an account with us. We're excited to have you on board!</p>
      <p>With your new account, you can:</p>
      <ul>
        <li>Shop our wide selection of products</li>
        <li>Track your orders in real-time</li>
        <li>Save your favorite items to your wishlist</li>
        <li>Leave reviews and ratings</li>
        <li>Get exclusive offers and promotions</li>
      </ul>
      <div class="text-center mt-4">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop" class="button">Start Shopping</a>
      </div>
      <p class="mt-4 text-muted">If you have any questions, feel free to contact our support team.</p>
    `),
    text: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || "Shop"}, ${params.name}! Thank you for creating an account.`,
  };

  await sendEmail({
    to: params.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

// ─── Order Confirmation Email ───────────────────────────────────────────

export async function sendOrderConfirmationEmail(params: {
  to: string;
  name: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}): Promise<void> {
  const itemsHtml = params.items
    .map(
      (item) => `
    <tr class="order-item">
      <td>${item.name}</td>
      <td class="text-center">${item.quantity}</td>
      <td class="text-right">$${item.price.toFixed(2)}</td>
    </tr>`
    )
    .join("");

  const template: EmailTemplate = {
    subject: `Order Confirmation - ${params.orderNumber}`,
    html: getBaseTemplate(`
      <h2>Order Confirmed!</h2>
      <p>Thank you for your order, ${params.name}. We've received your order and it's being processed.</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>Order Number:</strong> ${params.orderNumber}
      </div>

      <h3>Order Summary</h3>
      <table>
        <thead>
          <tr style="border-bottom: 2px solid #e2e8f0;">
            <td class="text-left"><strong>Item</strong></td>
            <td class="text-center"><strong>Qty</strong></td>
            <td class="text-right"><strong>Price</strong></td>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr style="border-top: 2px solid #e2e8f0;">
            <td colspan="2">Subtotal</td>
            <td class="text-right">$${params.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="2">Tax</td>
            <td class="text-right">$${params.tax.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="2">Shipping</td>
            <td class="text-right">$${params.shipping.toFixed(2)}</td>
          </tr>
          <tr style="font-weight: bold; font-size: 18px;">
            <td colspan="2">Total</td>
            <td class="text-right">$${params.total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <h3>Shipping Address</h3>
      <p>
        ${params.shippingAddress.line1}<br>
        ${params.shippingAddress.city}, ${params.shippingAddress.state} ${params.shippingAddress.postalCode}<br>
        ${params.shippingAddress.country}
      </p>

      <div class="text-center mt-4">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders" class="button">Track Order</a>
      </div>
    `),
    text: `Order Confirmation - ${params.orderNumber}. Total: $${params.total.toFixed(2)}`,
  };

  await sendEmail({
    to: params.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

// ─── Shipping Update Email ──────────────────────────────────────────────

export async function sendShippingUpdateEmail(params: {
  to: string;
  name: string;
  orderNumber: string;
  status: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
}): Promise<void> {
  const template: EmailTemplate = {
    subject: `Shipping Update - ${params.orderNumber}`,
    html: getBaseTemplate(`
      <h2>Shipping Update</h2>
      <p>Hi ${params.name},</p>
      <p>Your order <strong>${params.orderNumber}</strong> has been updated.</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>Status:</strong> ${params.status}
        ${params.trackingNumber ? `<br><strong>Tracking:</strong> ${params.trackingNumber}` : ""}
        ${params.carrier ? `<br><strong>Carrier:</strong> ${params.carrier}` : ""}
        ${params.estimatedDelivery ? `<br><strong>Estimated Delivery:</strong> ${params.estimatedDelivery}` : ""}
      </div>

      <div class="text-center mt-4">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders" class="button">Track Order</a>
      </div>
    `),
    text: `Shipping Update for order ${params.orderNumber}: ${params.status}`,
  };

  await sendEmail({
    to: params.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

// ─── Password Reset Email ───────────────────────────────────────────────

export async function sendPasswordResetEmail(params: {
  to: string;
  name: string;
  resetToken: string;
}): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${params.resetToken}`;

  const template: EmailTemplate = {
    subject: "Reset Your Password",
    html: getBaseTemplate(`
      <h2>Password Reset</h2>
      <p>Hi ${params.name},</p>
      <p>We received a request to reset your password. Click the button below to create a new password.</p>
      
      <div class="text-center mt-4">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>

      <p class="mt-4 text-muted">If you didn't request this, you can safely ignore this email. The link will expire in 24 hours.</p>
    `),
    text: `Reset your password: ${resetUrl}`,
  };

  await sendEmail({
    to: params.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

// ─── Low Stock Alert Email ──────────────────────────────────────────────

export async function sendLowStockAlertEmail(params: {
  to: string;
  productName: string;
  currentQuantity: number;
  threshold: number;
}): Promise<void> {
  const template: EmailTemplate = {
    subject: `Low Stock Alert - ${params.productName}`,
    html: getBaseTemplate(`
      <h2>Low Stock Alert</h2>
      <p>The following product is running low on stock:</p>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>${params.productName}</strong><br>
        Current Stock: ${params.currentQuantity}<br>
        Threshold: ${params.threshold}
      </div>

      <div class="text-center mt-4">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/products" class="button">Manage Inventory</a>
      </div>
    `),
    text: `Low Stock Alert: ${params.productName} - ${params.currentQuantity} units remaining`,
  };

  await sendEmail({
    to: params.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

// ─── Contact Form Email ─────────────────────────────────────────────────

export async function sendContactFormEmail(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const template: EmailTemplate = {
    subject: `Contact Form: ${params.subject}`,
    html: getBaseTemplate(`
      <h2>New Contact Form Submission</h2>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p><strong>Name:</strong> ${params.name}</p>
        <p><strong>Email:</strong> ${params.email}</p>
        <p><strong>Subject:</strong> ${params.subject}</p>
      </div>

      <h3>Message</h3>
      <p>${params.message.replace(/\n/g, "<br>")}</p>

      <div class="mt-4">
        <a href="mailto:${params.email}" class="button">Reply to ${params.name}</a>
      </div>
    `),
    text: `Contact Form: ${params.name} (${params.email}) - ${params.subject}: ${params.message}`,
  };

  await sendEmail({
    to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

// ─── Newsletter Email ───────────────────────────────────────────────────

export async function sendNewsletterEmail(params: {
  to: string[];
  subject: string;
  content: string;
}): Promise<void> {
  const template: EmailTemplate = {
    subject: params.subject,
    html: getBaseTemplate(params.content),
    text: params.content.replace(/<[^>]*>/g, ""),
  };

  for (const to of params.to) {
    await sendEmail({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }
}

// ─── Base Send Function ─────────────────────────────────────────────────

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}): Promise<void> {
  try {
    const transporter = await createTransporter();

    await transporter.sendMail({
      from: `"${process.env.NEXT_PUBLIC_APP_NAME || "Shop"}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      attachments: params.attachments,
    });

    console.log(`Email sent to ${params.to}: ${params.subject}`);
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}

// ─── Email Validation ───────────────────────────────────────────────────

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Bulk Email Helpers ─────────────────────────────────────────────────

export async function sendBulkEmail(params: {
  recipients: string[];
  subject: string;
  html: string;
  batchSize?: number;
}): Promise<{ sent: number; failed: number }> {
  const batchSize = params.batchSize || 50;
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < params.recipients.length; i += batchSize) {
    const batch = params.recipients.slice(i, i + batchSize);

    for (const recipient of batch) {
      try {
        await sendEmail({
          to: recipient,
          subject: params.subject,
          html: params.html,
        });
        sent++;
      } catch (error) {
        console.error(`Failed to send email to ${recipient}:`, error);
        failed++;
      }
    }

    // Add delay between batches to avoid rate limiting
    if (i + batchSize < params.recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return { sent, failed };
}
