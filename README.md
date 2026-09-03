# ShopHub - Full-Stack E-Commerce Platform

A complete, production-ready e-commerce platform built with Next.js 14, Prisma, Stripe, Tailwind CSS, and TypeScript.

## Features

### Core
- **Product Management**: Full CRUD with variants, images, categories, tags, and inventory tracking
- **Shopping Cart**: Persistent cart with coupon support and real-time calculations
- **Checkout Flow**: Multi-step checkout with Stripe payment integration
- **Order Management**: Order lifecycle tracking with status history

### Authentication
- **NextAuth.js**: Credentials, Google, and Facebook OAuth providers
- **Role-Based Access**: Customer, Admin, and Super Admin roles
- **Session Management**: JWT-based sessions with Redis caching

### Admin Dashboard
- **Analytics**: Revenue, orders, customers, and product analytics
- **Order Management**: View, update status, manage refunds
- **Product Management**: CRUD operations with bulk actions
- **Customer Management**: View customer profiles and order history

### UI/UX
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Component Library**: 20+ reusable UI components (Button, Card, Modal, Table, etc.)
- **Product Gallery**: Zoomable image gallery with thumbnails
- **Search & Filters**: Full-text search with category, price, and availability filters
- **Pagination**: Server-side and client-side pagination

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Cache | Redis |
| Payments | Stripe |
| Auth | NextAuth.js |
| Styling | Tailwind CSS |
| State | Zustand |
| Email | Nodemailer |
| Testing | Jest + React Testing Library |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Customer dashboard
│   ├── admin/             # Admin dashboard
│   ├── shop/              # Product listing & detail
│   ├── cart/              # Shopping cart
│   └── checkout/          # Checkout flow
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   ├── product/           # Product-specific components
│   ├── cart/              # Cart components
│   └── checkout/          # Checkout components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── db.ts             # Database helpers
│   ├── auth.ts           # Auth configuration
│   ├── stripe.ts         # Stripe integration
│   ├── redis.ts          # Redis caching
│   ├── email.ts          # Email service
│   └── utils.ts          # Utility functions
├── types/                 # TypeScript types
├── validators/            # Zod validation schemas
└── middleware.ts          # Next.js middleware
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis
- Stripe account

### Installation

```bash
# Clone the repository
git clone https://github.com/KhalidKhan541/ecommerce-platform.git
cd ecommerce-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
npx prisma generate
npx prisma db push
npx prisma db seed

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler
npm run test         # Run tests
npm run db:push      # Push schema to database
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (with filters) |
| GET | `/api/products/[slug]` | Get product details |
| GET | `/api/categories` | List categories |
| GET/POST | `/api/cart` | Get/add to cart |
| PATCH | `/api/cart/[id]` | Update cart item |
| DELETE | `/api/cart/[id]` | Remove cart item |
| POST | `/api/cart/coupon` | Apply coupon |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/[id]` | Get order details |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |

## Database Schema

- **User**: Authentication, roles, profile
- **Product**: Name, SKU, pricing, inventory, SEO
- **ProductVariant**: Size, color, price variants
- **ProductImage**: Image URLs with ordering
- **Category**: Hierarchical categories
- **Cart/CartItem**: Shopping cart
- **Order/OrderItem**: Order management
- **Payment**: Payment tracking
- **Shipment**: Shipping tracking
- **Address**: User addresses
- **Coupon**: Discount codes
- **Review**: Product reviews

## License

MIT License - see [LICENSE](LICENSE) for details.
