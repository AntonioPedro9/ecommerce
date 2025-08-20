# 🛍️ E-commerce Platform

A modern e-commerce platform built with Next.js, TypeScript, and PostgreSQL.

## ✨ Features

- **🛒 Shopping Cart Management** - Add, remove, and update cart items with real-time quantity controls
- **👤 User Authentication** - Secure authentication system with BetterAuth
- **🏠 Address Management** - Multiple shipping addresses
- **💳 Payment Processing** - Stripe integration for secure checkout
- **📊 Product Management** - Categories, variants, sizes, and stock tracking
- **📦 Order Management** - Complete order lifecycle from cart to fulfillment

## 🏗️ Architecture

### Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.44-orange?style=for-the-badge)
![Stripe](https://img.shields.io/badge/Stripe-18-008CDD?style=for-the-badge&logo=stripe)

### Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── authentication/   # Sign in/up pages
│   ├── cart/             # Shopping cart functionality
│   ├── checkout/         # Payment and order processing
│   ├── product/          # Product detail pages
│   ├── category/         # Category browsing
│   └── my-orders/        # Order history
├── actions/              # Server Actions for data mutations
├── components/           # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── common/           # Custom business components
├── db/                   # Database schema and configuration
├── hooks/                # Custom React Query hooks
├── lib/                  # Utility functions and configurations
└── providers/            # React context providers
```

### Database Schema

![Database Schema](docs/diagram.png)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AntonioPedro9/ecommerce
   cd bootcamp-ecommerce
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file with the following variables:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   AUTH_SECRET="your-auth-secret"
   ```

4. **Database Setup**

   ```bash
   # Generate and run migrations
   npm run db:generate
   npm run db:migrate

   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.
