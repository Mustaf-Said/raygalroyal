# RayGalRoyal

A modern, fully-featured SaaS platform built with **Next.js 16** and **Supabase**, providing freelancer services, project management, domain registration, payment processing, and admin capabilities with comprehensive multi-language support.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Core Features](#core-features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Multi-Language Support](#multi-language-support)
- [Authentication & Security](#authentication--security)
- [API Endpoints](#api-endpoints)
- [Development Patterns](#development-patterns)
- [Deployment](#deployment)
- [Learn More](#learn-more)

---

## 🎯 Overview

**RayGalRoyal** is a comprehensive platform designed to facilitate freelancer hiring, project management, domain services, and payment processing. It features:

- **Professional Services Marketplace**: Showcase services with pricing tiers (Basic, Pro, Enterprise)
- **Project Management**: Order workflow with file uploads to Supabase Storage
- **Freelancer Network**: Freelancer profiles, applications, and admin management
- **Domain Services**: Namecheap affiliate integration for domain registration
- **Payment Processing**: Stripe and PayPal integration for flexible checkout
- **Admin Dashboard**: Comprehensive admin panel with role-based access control
- **Messaging System**: Built-in messaging between users
- **Multi-Language Interface**: Full support for English, Somali, and Arabic (with RTL support)
- **Secure Architecture**: Frontend never directly calls Supabase; all data flows through backend

---

## 🛠️ Tech Stack

| Layer                    | Technology         | Version | Purpose                                          |
| ------------------------ | ------------------ | ------- | ------------------------------------------------ |
| **Frontend Framework**   | Next.js            | 16.1.1  | React framework with App Router                  |
| **Language**             | TypeScript         | 5.x     | Type-safe development                            |
| **Styling**              | Tailwind CSS       | 4.x     | Utility-first CSS framework                      |
| **UI Components**        | Lucide React       | 0.577.0 | Icon library                                     |
| **Animations**           | Framer Motion      | 12.36.0 | React animation library                          |
| **Database**             | Supabase           | 2.99.1  | PostgreSQL + Auth + Storage                      |
| **Payment - Stripe**     | Stripe             | 20.4.1  | Card payments & checkout                         |
| **Internationalization** | Custom i18n        | -       | Multi-language support (3 languages)             |
| **Styling Utilities**    | Tailwind Merge     | 3.5.0   | Merge Tailwind class names                       |
| **Icons Fallback**       | React Icons        | 5.5.0   | Icon library alternative                         |
| **Country Flags**        | Country Flag Icons | 1.6.15  | Flag display                                     |
| **Linting**              | ESLint             | 9.x     | Code quality                                     |
| **Build Tool**           | Webpack (Dev)      | -       | Used in dev to avoid Turbopack issues on Windows |

---

## 🏗️ Architecture

### Core Principle: **Frontend → Backend → Supabase**

The application follows a strict security pattern where the frontend never directly accesses Supabase, ensuring all data operations go through secure backend endpoints that validate user roles and permissions.

**Workflow:**

1. Frontend makes HTTP request to Next.js API route
2. Backend validates authentication and role
3. Backend queries Supabase using SERVICE_ROLE_KEY (privileged access)
4. Backend returns filtered response to frontend

**Key Rules:**

- Frontend uses ANON_KEY for auth context only
- Backend uses SERVICE_ROLE_KEY for data operations
- Role validation always happens server-side
- Admin/freelancer routes protected by middleware with HTTP-only cookies
- Next.js middleware checks `admin_session` cookie on `/admin/*` routes

---

## ✨ Core Features

### 1. **Hero & Services Section**

- Eye-catching hero banner with CTAs
- Service cards showcasing offerings
- Guaranteed satisfaction messaging

### 2. **Project Order Flow**

- Multi-step order creation (user details → project details → payment)
- File upload integration with Supabase Storage (bucket: `project-files`)
- Support for flexible custom pricing (Support plan)
- Order tracking with status management

### 3. **Freelancer System**

- Public freelancer profiles with bios
- Freelancer registration and application workflow
- Admin approval/rejection process
- Freelancer dashboard for profile updates
- Role-based access control

### 4. **Domain Services**

- Domain search with availability checking
- Dynamic add-on pricing (SSL, Hosting, Email)
- Affiliate redirect to Namecheap registration
- Search logging for analytics

### 5. **Payment Integration**

- **Stripe**: Card payments for Basic/Pro/Enterprise plans
- **PayPal**: Alternative checkout option
- Secure checkout session creation
- Order amount validation

### 6. **Admin Dashboard**

- Protected routes with session cookie validation
- Order management
- Review moderation
- Freelancer application approval
- Domain add-ons pricing management

### 7. **Multi-Language Support**

- English, Somali, and Arabic (with RTL support)
- Hydration-safe language switching
- localStorage persistence
- Automatic dir/lang attribute updates

### 8. **Messaging & Communication**

- User-to-user messaging system
- Admin message visibility
- Real-time updates via Supabase

### 9. **Reviews & Testimonials**

- Customer review submission
- Review carousel display
- Star ratings and feedback

### 10. **Content Pages**

- About, Services, Team, FAQ
- Privacy Policy, Terms, Cookie Policy
- Blog sections and guides
- Contact form integration

---

## 📁 Project Structure

```
raygalroyal/
├── app/
│   ├── api/                        # Backend endpoints
│   │   ├── admin/                  # Admin auth & management
│   │   ├── freelancer/             # Freelancer auth & profile
│   │   ├── freelancer-applications/ # Application workflow
│   │   ├── create-order/           # Order creation
│   │   ├── create-checkout-session/ # Payment checkout
│   │   ├── upload-file/            # File uploads
│   │   ├── messages/               # Messaging
│   │   ├── reviews/                # Reviews
│   │   ├── domain/                 # Domain services
│   │   └── supabase/               # Utility endpoints
│   │
│   ├── admin/                      # Protected admin pages
│   ├── freelancer/                 # Freelancer auth pages
│   ├── components/                 # Reusable UI components
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Homepage
│
├── lib/                            # Utilities
│   ├── supabase.ts
│   ├── authHelpers.ts
│   ├── requestAuth.ts
│   ├── database.types.ts
│   └── utils.ts
│
├── locales/                        # Translations
│   ├── en.ts
│   ├── so.ts
│   ├── ar.ts
│   └── index.ts
│
├── public/                         # Static assets
├── styles/                         # Global CSS
├── middleware.ts                   # Admin route protection
└── supabase_setup.sql              # Database init
```

---

## 📦 Prerequisites

- **Node.js**: v16 or higher
- **npm/yarn/pnpm/bun**: Package manager
- **Supabase Account**: For database and authentication
- **Stripe Account** (Optional): For payments
- **Namecheap API** (Optional): For domain services

---

## 🚀 Installation & Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Environment Variables

Create `.env.local`:

```bash
# REQUIRED
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAILS=admin@example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# STRIPE
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ENTERPRISE=price_...

# OPTIONAL
NEXT_PUBLIC_PAYPAL_CHECKOUT_URL=https://sandbox.paypal.com/...
NEXT_PUBLIC_NAMECHEAP_AFFILIATE_URL=https://namecheap.pxf.io/...
SENDGRID_API_KEY=your_key
```

### Step 3: Supabase Setup

**Storage Bucket:**

- Create bucket named exactly `project-files` in Supabase Dashboard
- Or enable auto-creation via SERVICE_ROLE_KEY

**Database:**

1. Go to Supabase SQL Editor
2. Copy contents of `supabase_setup.sql`
3. Run the script
4. All tables and RLS policies auto-created

### Step 4: Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌍 Multi-Language Support

### Supported Languages

- **English** (en) - LTR
- **Somali** (so) - LTR
- **Arabic** (ar) - RTL

### Usage

```typescript
import { useLanguage } from "@/components/LanguageProvider"

export function MyComponent() {
  const { t, language, toggleLanguage } = useLanguage()
  return <h1>{t.hero.title}</h1>
}
```

---

## 🔐 Authentication & Security

### Admin Login

1. POST `/api/admin/login` with email/password
2. Server validates role (via ADMIN_EMAILS or app_metadata.role)
3. Sets HTTP-only `admin_session` cookie
4. Middleware protects `/admin/*` routes

### Freelancer Auth

1. POST `/api/freelancer/register` or `/api/freelancer/login`
2. Can complete profile in dashboard
3. Admin approves in application workflow

### Security Rules

⚠️ **Critical:**

- Never use `user_metadata.role` (user-editable)
- Always use `app_metadata.role` (server-side only)
- All role validation happens server-side
- Middleware uses HTTP-only cookies

---

## 🔌 API Endpoints

### Admin

- `POST /api/admin/login` - Login with role validation
- `POST /api/admin/logout` - Clear session
- `GET /api/admin/orders` - List all orders
- `PATCH /api/admin/domain-add-ons` - Manage pricing

### Freelancer

- `POST /api/freelancer/register` - Register
- `POST /api/freelancer/login` - Login
- `PATCH /api/freelancer/update` - Update profile
- `GET /api/freelancers` - Public profiles

### Orders & Payment

- `POST /api/create-order` - Create order
- `POST /api/create-checkout-session` - Stripe/PayPal checkout
- `POST /api/upload-file` - File upload

### Domain Services

- `GET /api/domain/search` - Search domains
- `GET /api/domain/add-ons` - Get add-on options

### Utilities

- `GET/POST /api/messages` - Messaging
- `POST /api/contact` - Contact form

---

## 💡 Development Patterns

### File Upload

```typescript
const formData = new FormData();
formData.append("file", file);
const response = await fetch("/api/upload-file", {
  method: "POST",
  body: formData,
});
```

### Data Fetching

```typescript
const response = await fetch(`/api/orders?user_id=${userId}`);
const { data } = await response.json();
```

### Admin Validation

```typescript
import { isAdminUser } from "@/lib/requestAuth";

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!isAdminUser(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}
```

---

## 🚢 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import at [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy

### Build & Start

```bash
npm run build
npm run start
```

---

## 📖 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)

### Project Guides

- **Auth**: `STRICT_LOGIN_VALIDATION_GUIDE.md`
- **Cookies**: `SESSION_COOKIE_FIX.md`
- **Architecture**: `STRICT_LOGIN_ARCHITECTURE.md`

---

## 🎉 Quick Start Reference

```bash
# 1. Install
npm install

# 2. Create .env.local (see above)

# 3. Setup Supabase
#    - Run supabase_setup.sql
#    - Create project-files bucket

# 4. Start
npm run dev

# 5. Test
# Homepage: http://localhost:3000
# Admin: http://localhost:3000/admin/login
# Freelancer: http://localhost:3000/freelancer/login
# Domain Search: http://localhost:3000/domain-search
```

---

**Happy building! 🚀**
