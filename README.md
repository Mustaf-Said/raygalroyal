# Raygal Royal — Digital Agency Platform

A full-stack digital agency web application built with **Next.js 15 (App Router)**, **Supabase**, and **Stripe**. The platform serves as both the public-facing website for a professional digital agency and a complete SaaS product offering domain registration, service packages, a freelancer job board, customer review moderation, and a full admin panel.

**Live site:** [raygalroyal.com](https://raygalroyal.com)  
**Based in:** Gothenburg, Sweden

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Database Schema](#database-schema)
- [Authentication & Security](#authentication--security)
- [API Endpoints](#api-endpoints)
- [Internationalization](#internationalization)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [Deployment](#deployment)

---

## Overview

Raygal Royal is a **professional digital agency** specializing in web development, mobile app development, UI/UX design, cloud solutions, AI integration, and security audits. The platform provides:

- A public marketing site with services, pricing, portfolio, team, and contact sections
- **Service packages** with fixed pricing (Standard $1,499 / Professional $2,999 / Enterprise custom) and a **25% discount toggle**
- A **domain search and purchase flow** powered by the Namecheap API and Stripe, with optional hosting, email, and SSL add-ons
- A **freelancer job board** with application → admin approval → public listing workflow
- A **customer review system** with submission, admin moderation, and multilingual display
- A **full admin panel** for managing orders, freelancers, reviews, payments, and domain add-on pricing
- **Multi-language support** (English, Somali, Arabic with RTL)
- **Dark/Light theme** toggle (dark by default)
- GDPR-compliant cookie banner and full privacy, terms, and cookie policy pages

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js | 16.1.1 | React App Router, SSR, API Routes |
| **Language** | TypeScript | 5.x | Type safety across frontend and backend |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS |
| **Animation** | Framer Motion | 12.36.0 | Page and component animations |
| **Icons** | Lucide React | 0.577.0 | UI icon set |
| **Icons** | React Icons | 5.5.0 | Supplementary icons |
| **Database & Auth** | Supabase | 2.99.1 | PostgreSQL, Supabase Auth, Storage |
| **Payments** | Stripe | 20.4.1 | Checkout Sessions, Webhooks |
| **Email** | Resend API | — | Transactional email (contact form, order confirmations) |
| **Domain** | Namecheap API | — | Domain availability, pricing, registration |
| **Hosting Provisioning** | Hetzner Cloud API | — | VPS hosting for customer domains |
| **Email Provisioning** | Zoho Mail API | — | Business email mailbox creation |
| **Sitemap** | next-sitemap | 4.2.3 | Automated XML sitemap generation |
| **Utilities** | clsx / tailwind-merge | — | Conditional class composition |
| **Flags** | country-flag-icons | 1.6.15 | Language/country flag display |

---

## Architecture

### Core Principle: Frontend → API Routes → Supabase

The application enforces a strict three-layer architecture. The frontend **never** calls Supabase directly for data operations. All database reads and writes go through Next.js API Routes (`app/api/*`), which authenticate the request and then call Supabase using the `SUPABASE_SERVICE_ROLE_KEY`.

```
Browser (React)
    │
    │  fetch("/api/...")
    ▼
Next.js API Route (server-side)
    │  - Validates auth (cookie / Bearer token / env whitelist)
    │  - Business logic
    │  - Uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS)
    ▼
Supabase PostgreSQL
```

**Why this matters:**
- The anon key is never used for privileged data access
- Role validation always happens server-side — the frontend cannot forge a role
- Row Level Security on Supabase acts as a second line of defence for any direct client access
- The `SUPABASE_SERVICE_ROLE_KEY` is never exposed to the browser

### Middleware

`middleware.ts` runs on every request to `/admin/*`. It checks for the `admin_session` HTTP-only cookie. If missing, the request is redirected to `/admin/login`. This protects all admin pages at the Edge, before any React code runs.

---

## Features

### 1. Public Marketing Site

The homepage (`/`) assembles these sections in order:

| Component | Section |
|---|---|
| `Hero` | Full-screen hero with video background, domain search field, stats badges, and CTA buttons |
| `Services` | Six service cards: Web Development, Mobile Apps, UI/UX Design, Cloud Solutions, AI Integration, Security & Audit |
| `Projects` | Featured portfolio: Global E-Commerce, FinTech Dashboard, Health Portal |
| `Testimonials` | Approved customer reviews carousel + review submission form |
| `Guarantee` | Quality guarantee section with checklist |
| `Team` | Approved freelancer cards with freelancer application form |
| `Pricing` | Four pricing plans with 25% discount toggle |
| `DoneProjects` | Delivered platform showcase (Sahal marketplace, PodManager, Somaliland Gov) |
| `FAQ` | Accordion FAQ |
| `Contact` | Contact form + WhatsApp link + office location |

### 2. Pricing & Payments

Four service plans:

| Plan | Price | Notes |
|---|---|---|
| Support | Custom (min $10) | Pay agreed support amount in SEK via Stripe |
| Standard | $1,499 | Fixed Stripe Price ID |
| Professional | $2,999 | Fixed Stripe Price ID — "Most Popular" |
| Enterprise | Custom | Opens order modal, negotiated price |

A **25% discount toggle** reduces Standard and Professional prices (`$1,499 → $1,124` and `$2,999 → $2,249`) and displays savings. The toggle also applies a badge to Enterprise plans.

Payment flow:
1. User selects plan → `POST /api/create-order` creates a `project_orders` row (status: `pending`)
2. `POST /api/create-checkout-session` creates a Stripe Checkout Session
3. Stripe redirects to success URL with `session_id`
4. Success page reads the order from Supabase

### 3. Domain Search & Purchase

Located at `/domain-search`, the flow:

1. User types a domain name in the hero or domain-search page
2. `GET /api/domain/check` queries Namecheap API (or falls back to public page scraping)
3. Results display availability status, live price, and premium flags for 8 TLDs: `.com`, `.net`, `.io`, `.co`, `.co.uk`, `.org`, `.to`, `.london`
4. User adds a domain to cart and optionally selects add-ons:
   - **SSL Certificate** — free (auto-provisioned via `lib/providers/ssl.ts`)
   - **Web Hosting** — $9 basic / $19 pro / $39 business (Hetzner Cloud)
   - **Business Email** — $3/mailbox (Zoho Mail)
5. Checkout → `POST /api/payment/create-checkout` creates a pending `orders` row and a Stripe Checkout Session
6. After payment, Stripe webhook (`POST /api/payment/webhook`) calls `fulfillPaidOrder()`:
   - Marks order `paid` → `registered`
   - Provisions Hetzner server (if hosting selected)
   - Creates Zoho mailboxes (if email selected)
   - Issues SSL certificate
   - Sends order confirmation email via Resend

The domain registration itself uses a Namecheap **affiliate link** (`lib/domain/affiliate.ts`), directing the customer to Namecheap's registration results page with the agency's affiliate ID embedded.

### 4. Freelancer System

Three-phase workflow:

**Phase 1 — Application:**
- `POST /api/freelancer-applications` validates the application and checks for duplicate emails
- Freelancers must register a Supabase Auth account first, then complete their profile in the dashboard

**Phase 2 — Admin Review:**
- Admin sees all freelancers at `/admin/freelancers`
- `POST /api/freelancer-applications/approve` or `/reject` updates the `status` field in `freelancers` table

**Phase 3 — Public Profile:**
- Only `status = 'approved'` freelancers appear at `/freelancers` (fetched via `GET /api/freelancers`)
- The homepage Team section shows a subset of approved freelancers

Freelancer dashboard (`/freelancer/dashboard`):
- View and edit their own profile (name, bio, phone, GitHub, title in all 3 languages)
- `PATCH /api/freelancer/update` validates the JWT Bearer token before updating

### 5. Customer Reviews

Review flow:
1. Customer opens the review form on the homepage
2. `POST /api/reviews` validates input, applies rate limiting (5 submissions per IP per 10 minutes), checks honeypot field, and inserts with `status = 'pending'`
3. Admin notification email is sent via Resend
4. Admin visits `/admin/reviews`, adds multilingual translations/responses, then clicks "Approve"
5. `PATCH /api/admin/reviews/[id]` updates status to `approved` and stores translated messages
6. `GET /api/reviews` returns only approved reviews to the public carousel

Reviews support multilingual content: the original message is stored in the language it was written in (`message_en`, `message_so`, or `message_ar`), and the admin can provide translations in all three. The carousel renders the version matching the current UI language.

### 6. Admin Panel

Protected by `middleware.ts` — requires `admin_session` cookie.

| Route | Purpose |
|---|---|
| `/admin/orders` | View all `project_orders` (service package purchases) |
| `/admin/payments` | View all `orders` (domain purchases) |
| `/admin/freelancers` | Approve / reject freelancer applications |
| `/admin/reviews` | Moderate reviews, add multilingual responses |
| `/admin/messages` | View user messages |
| `/admin/domain-add-ons` | Manage SSL / Hosting / Email pricing and enabled status |

Admin identity is determined by:
1. **ADMIN_EMAILS** env var — comma-separated list of admin email addresses
2. Fallback: `app_metadata.role = "admin"` in Supabase Auth user metadata

### 7. Contact & Email

- Contact form at `/contact` sends email via Resend API (`POST /api/contact`)
- Recipient: `raygal99@gmail.com`
- "From" address: configurable via `CONTACT_FROM_EMAIL`, falls back to Resend's `onboarding@resend.dev`
- Order confirmation emails sent automatically after successful payment
- Admin notification emails sent when new reviews are submitted

### 8. Blog & SEO Content

Static content pages optimized for SEO:

- `/blog/namecheap-review` — Namecheap affiliate review
- `/blog/best-domain-registrars` — Domain registrar comparison
- `/recommended-tools` — Tool recommendations with affiliate links
- `/affiliate-disclosure` — Affiliate transparency page

SEO components: `OrganizationSchema`, `ArticleSchema`, `BreadcrumbSchema`, `ReviewSchema`, `JsonLd` — all inject structured data (JSON-LD) into page `<head>`.

### 9. Legal & Compliance Pages

- `/privacy` and `/privacy-policy` — Full GDPR privacy policy
- `/terms` and `/terms-of-service` — Terms and conditions (50% deposit, refund policy, IP transfer)
- `/cookies` — Cookie policy (necessary, analytics, marketing categories)
- GDPR-compliant cookie consent banner (`CookieBanner`) — accept/decline with localStorage persistence
- 3-year data retention policy documented

---

## Database Schema

All tables live in Supabase's `public` schema with Row Level Security enabled.

### `project_orders`

Service package purchases (Standard, Professional, Enterprise, Support plans).

| Column | Type | Description |
|---|---|---|
| `id` | uuid (PK) | Auto-generated |
| `plan` | text | `standard`, `pro`, `enterprise`, `support` |
| `description` | text | Project description from customer |
| `file_url` | text | Supabase Storage URL for uploaded brief |
| `customer_email` | text | Customer contact email |
| `service` | text | Selected service type |
| `language` | text | UI language at time of order |
| `status` | text | `pending`, `paid`, `completed` |
| `amount` | numeric | Plan price |
| `custom_amount` | numeric | Custom amount for support plan |
| `currency` | text | `USD` or `SEK` |
| `provider` | text | `stripe` |
| `payment_id` | text | Stripe session ID |
| `created_at` | timestamptz | — |
| `updated_at` | timestamptz | Auto-updated by trigger |

**RLS:** Public INSERT, UPDATE, SELECT (needed for order flow without auth).

### `orders`

Domain purchase orders. Created by the backend when a customer selects a domain.

| Column | Type | Description |
|---|---|---|
| `id` | uuid (PK) | — |
| `domain` | text | Purchased domain (e.g. `example.com`) |
| `price` | numeric | Domain base price |
| `user_email` | text | Customer email (no Supabase account required) |
| `payment_provider` | text | `stripe` |
| `status` | text | `pending` → `paid` → `registered` |
| `payment_id` | text | Stripe session ID |
| `currency` | text | `USD` |
| `total_price` | numeric | Domain + extras |
| `customer_name` | text | — |
| `extras` | jsonb | `{hosting, email, ssl}` add-on selections |
| `registrar_order_id` | text | `affiliate-flow` (Namecheap affiliate model) |
| `created_at` | timestamptz | — |

**Unique index:** One paid/registered order per domain.

**RLS:** Authenticated users can SELECT their own orders (matched by `user_email = auth.email()`); admins see all; all writes are backend-only.

### `freelancers`

Combined application + profile table for the freelancer system.

| Column | Type | Description |
|---|---|---|
| `id` | bigserial (PK) | — |
| `user_id` | uuid (FK → auth.users) | Supabase Auth user |
| `name` | text | Full name |
| `email` | text | Contact email |
| `role` | text | Job title / role |
| `bio` | text | Bio (default language) |
| `title_en/so/ar` | text | Multilingual job titles |
| `bio_en/so/ar` | text | Multilingual bios |
| `profile_image` | text | Supabase Storage URL |
| `phone` | text | — |
| `github` | text | GitHub profile URL |
| `message` | text | Application message |
| `status` | text | `pending`, `approved`, `rejected` |
| `created_at` | timestamptz | — |

**RLS:** Public SELECT for approved freelancers only; authenticated users INSERT/UPDATE/DELETE own row only.

### `reviews`

Customer testimonials with admin moderation.

| Column | Type | Description |
|---|---|---|
| `id` | uuid (PK) | — |
| `name` | text | Reviewer name |
| `message` | text | Original message |
| `message_en/so/ar` | text | Translated versions (admin-filled) |
| `rating` | int | 1–5 |
| `admin_response` | text | Admin reply (default) |
| `admin_response_en/so/ar` | text | Translated admin responses |
| `status` | text | `pending` or `approved` |
| `created_at` | timestamptz | — |

**RLS:** Public SELECT for approved only; anon INSERT for pending status only; admin UPDATE/DELETE.

### `messages`

Internal messaging between authenticated users.

| Column | Type | Description |
|---|---|---|
| `id` | uuid (PK) | — |
| `sender_id` | uuid (FK) | Supabase Auth user |
| `receiver_id` | uuid (FK) | Supabase Auth user |
| `message` | text | Message body |
| `created_at` | timestamptz | — |

**RLS:** Users can only read their own messages; users can only insert messages where `sender_id = auth.uid()`.

### `hosting_accounts`

Records of Hetzner VPS servers provisioned for domain customers.

| Column | Type | Description |
|---|---|---|
| `id` | uuid (PK) | — |
| `domain` | text | Customer domain |
| `server_id` | text | Hetzner server ID |
| `plan` | text | `basic`, `pro`, `business` |
| `created_at` | timestamptz | — |

**RLS:** Admin only.

### `email_accounts`

Records of Zoho Mail mailboxes created for domain customers.

| Column | Type | Description |
|---|---|---|
| `id` | uuid (PK) | — |
| `domain` | text | Customer domain |
| `email_address` | text | Created mailbox address |
| `provider` | text | `zoho` |
| `created_at` | timestamptz | — |

**RLS:** Admin only.

### `ssl_certificates`

SSL certificate issuance records.

| Column | Type | Description |
|---|---|---|
| `id` | uuid (PK) | — |
| `domain` | text | Domain |
| `status` | text | `pending`, `issued` |
| `issued_at` | timestamptz | — |
| `created_at` | timestamptz | — |

**RLS:** Admin only.

### `domain_search_logs`

Anonymous logging of domain searches for analytics.

| Column | Type | Description |
|---|---|---|
| `id` | uuid (PK) | — |
| `domain` | text | Searched domain |
| `created_at` | timestamptz | — |

**RLS:** Anyone can INSERT; admins can SELECT.

### `domain_add_ons`

Admin-configurable pricing for domain purchase add-ons.

| Column | Type | Description |
|---|---|---|
| `id` | text (PK) | `ssl`, `hosting`, `email` |
| `price` | numeric | Price in USD |
| `enabled` | boolean | Whether to show this add-on |
| `updated_at` | timestamptz | — |

**RLS:** Public SELECT; admin INSERT/UPDATE/DELETE.

---

## Authentication & Security

### Admin Authentication

1. Admin visits `/admin/login` and submits credentials
2. `POST /api/admin/login` authenticates via `supabase.auth.signInWithPassword()`
3. The server checks if the authenticated user's email is in `ADMIN_EMAILS` (env var) or has `app_metadata.role = "admin"`
4. On success, an HTTP-only `admin_session` cookie (7-day TTL) is set containing the Supabase access token
5. `middleware.ts` reads this cookie on every `/admin/*` request; missing or invalid → redirect to `/admin/login`
6. Protected API routes additionally call `requireAdminFromRequest()` which validates the `Authorization: Bearer <token>` header against Supabase Auth

### Freelancer Authentication

1. Freelancer registers a Supabase Auth account at `/freelancer/register`
2. `POST /api/freelancer/login` authenticates with Supabase Auth, verifies the user is **not** an admin, and verifies a matching row exists in the `freelancers` table
3. The Supabase access token is stored in `localStorage` (`freelancerAccessToken`)
4. Protected freelancer API calls send `Authorization: Bearer <token>` header
5. Backend validates the token, retrieves the user from Supabase Auth, and confirms ownership before allowing updates

### Security Measures

- `admin_session` cookie is `httpOnly`, `secure` (in production), `sameSite: lax`
- Admin email whitelist via `ADMIN_EMAILS` env var — user cannot elevate privileges from the browser
- `app_metadata.role` (not `user_metadata.role`) is used for server-side role checks — `user_metadata` is user-editable
- Rate limiting on review submissions: 5 per IP per 10 minutes, in-memory store
- Honeypot field on review form to block bots
- Input validation and sanitization on all API routes
- `SUPABASE_SERVICE_ROLE_KEY` is server-only, never exposed to the browser

---

## API Endpoints

### Admin
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Admin login — sets `admin_session` cookie |
| `POST` | `/api/admin/logout` | Clears admin session cookie |
| `GET` | `/api/admin/orders` | List all domain orders |
| `GET` | `/api/admin/reviews` | List all reviews (pending + approved) |
| `PATCH` | `/api/admin/reviews/[id]` | Update review status/translations/response |
| `GET/PATCH` | `/api/admin/domain-add-ons` | Manage add-on pricing and enabled state |

### Freelancer
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/freelancer/register` | Create Supabase Auth account + freelancer row |
| `POST` | `/api/freelancer/login` | Authenticate freelancer |
| `GET` | `/api/freelancer/profile` | Get own profile (Bearer auth) |
| `PATCH` | `/api/freelancer/update` | Update own profile (Bearer auth) |
| `GET` | `/api/freelancers` | Public list of approved freelancers |
| `POST` | `/api/freelancer-applications` | Submit application |
| `POST` | `/api/freelancer-applications/approve` | Admin: approve application |
| `POST` | `/api/freelancer-applications/reject` | Admin: reject application |

### Orders & Payments
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/create-order` | Create `project_orders` row |
| `POST` | `/api/create-checkout-session` | Create Stripe Checkout Session for service plan |
| `POST` | `/api/checkout` | Checkout shortcut for pricing page |
| `POST` | `/api/payment/create-checkout` | Create Stripe Checkout for domain order |
| `POST` | `/api/payment/webhook` | Stripe webhook — marks order paid, fulfills |
| `POST` | `/api/payment/order` | Retrieve order details |
| `POST` | `/api/webhooks/stripe` | Alternative Stripe webhook endpoint |

### Domain
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/domain/check` | Check domain availability + price (Namecheap API) |
| `GET` | `/api/domain/add-ons` | Fetch enabled add-ons and pricing |
| `POST` | `/api/domain/search-log` | Log a domain search |
| `POST` | `/api/domain/register` | Register domain |

### Other
| Method | Route | Description |
|---|---|---|
| `GET/POST` | `/api/reviews` | Public: GET approved, POST new review |
| `POST` | `/api/contact` | Contact form → Resend email |
| `GET` | `/api/auth/me` | Get current authenticated user |
| `POST` | `/api/auth/forgot-password` | Send password reset email |
| `POST` | `/api/auth/reset-password` | Reset password with token |
| `POST` | `/api/messages` | Send message |
| `POST` | `/api/upload-file` | Upload file to Supabase Storage |
| `POST` | `/api/hosting/create` | Provision Hetzner server |
| `POST` | `/api/email/create` | Create Zoho mailbox |
| `POST` | `/api/ssl/create` | Issue SSL certificate |

---

## Internationalization

Three languages are supported, stored in `locales/`:

| File | Language | Direction |
|---|---|---|
| `locales/en.ts` | English | LTR (default) |
| `locales/so.ts` | Somali | LTR |
| `locales/ar.ts` | Arabic | RTL |

### How it works

1. `LanguageProvider` wraps the app in `app/layout.tsx`
2. Language is persisted to `localStorage` as `raygalroyal-language`
3. `useSyncExternalStore` reads localStorage on the client — no hydration mismatch
4. The server always renders with `"en"` (via `getServerSnapshot`)
5. On language change, `document.documentElement.lang` and `dir` are updated
6. Arabic sets `dir="rtl"` on `<html>` — all CSS layout reverses automatically via Tailwind

### Usage in components

```tsx
import { useLanguage } from "./LanguageProvider"

export function MyComponent() {
  const { t, language, toggleLanguage } = useLanguage()
  return <h1>{t.hero.title}</h1>
}
```

All translation strings are fully typed via `TranslationStrings` (derived from the English locale file with `DeepStringify<typeof en>`).

---

## Project Structure

```
raygalroyal/
├── app/
│   ├── api/                          # All API routes (backend layer)
│   │   ├── admin/                    # Admin auth + management
│   │   ├── auth/                     # Password reset
│   │   ├── checkout/                 # Service plan checkout
│   │   ├── contact/                  # Contact form email
│   │   ├── create-checkout-session/  # Stripe session for service plans
│   │   ├── create-order/             # Create project_orders row
│   │   ├── domain/                   # Domain check, add-ons, register, search-log
│   │   ├── email/                    # Zoho email provisioning
│   │   ├── freelancer/               # Freelancer auth + profile
│   │   ├── freelancer-applications/  # Application approval workflow
│   │   ├── freelancers/              # Public freelancer listing
│   │   ├── hosting/                  # Hetzner hosting provisioning
│   │   ├── messages/                 # Messaging
│   │   ├── payment/                  # Domain payment + webhook
│   │   ├── reviews/                  # Public review submission + listing
│   │   ├── ssl/                      # SSL certificate provisioning
│   │   ├── supabase/                 # Bucket creation utility
│   │   ├── upload-file/              # File upload to Supabase Storage
│   │   └── webhooks/                 # Stripe webhook
│   │
│   ├── admin/                        # Protected admin dashboard pages
│   │   ├── login/
│   │   ├── orders/
│   │   ├── payments/
│   │   ├── freelancers/
│   │   ├── reviews/
│   │   ├── messages/
│   │   └── domain-add-ons/
│   │
│   ├── freelancer/                   # Freelancer auth + dashboard
│   │   ├── login/
│   │   ├── register/
│   │   └── dashboard/
│   │
│   ├── components/                   # Shared UI components
│   │   ├── domain-search/            # Domain search UI components
│   │   ├── seo/                      # JSON-LD schema components
│   │   ├── content/                  # Blog layout components
│   │   ├── LanguageProvider.tsx      # i18n context + hook
│   │   ├── ThemeProvider.tsx         # Dark/Light theme context
│   │   ├── ModalProvider.tsx         # Order modal context
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── Pricing.tsx               # Pricing cards with discount toggle
│   │   ├── ReviewForm.tsx            # Customer review submission form
│   │   ├── ReviewsCarousel.tsx       # Approved reviews display
│   │   ├── OrderFlow.tsx             # Multi-step order form
│   │   ├── CookieBanner.tsx          # GDPR cookie consent
│   │   └── ...
│   │
│   ├── blog/                         # Affiliate blog content
│   ├── domain-search/                # Domain search page
│   ├── checkout/                     # Domain checkout page
│   ├── payment-success/              # Payment confirmation page
│   ├── freelancers/                  # Public freelancer directory
│   ├── about/
│   ├── services/
│   ├── pricing/
│   ├── contact/
│   ├── faq/
│   ├── privacy-policy/
│   ├── terms-of-service/
│   ├── affiliate-disclosure/
│   ├── recommended-tools/
│   ├── forgot-password/
│   ├── reset-password/
│   ├── layout.tsx                    # Root layout with all providers
│   ├── page.tsx                      # Homepage
│   └── sitemap.ts                    # Dynamic sitemap
│
├── lib/                              # Server-side utilities
│   ├── database.types.ts             # Generated Supabase type definitions
│   ├── supabase.ts                   # Supabase anon client
│   ├── server/
│   │   └── supabaseAdmin.ts          # Supabase SERVICE_ROLE client
│   ├── adminAuth.ts                  # requireAdminFromRequest()
│   ├── adminClientAuth.ts            # Client-side admin token helpers
│   ├── freelancerAuth.ts             # Client-side freelancer token helpers
│   ├── requestAuth.ts                # isAdminUser() helper
│   ├── authHelpers.ts                # Shared auth utilities
│   ├── emails.ts                     # Resend email functions
│   ├── utils.ts                      # cn() class utility
│   ├── domain/
│   │   ├── affiliate.ts              # Namecheap affiliate URL builder
│   │   ├── commerce.ts               # Domain order lifecycle (create/pay/fulfill)
│   │   ├── constants.ts              # TLD list, prices, hosting plans
│   │   ├── domainSearch.ts           # Domain query normalization
│   │   └── validation.ts             # Domain format validation
│   ├── providers/
│   │   ├── namecheap.ts              # Namecheap API client
│   │   ├── hetzner.ts                # Hetzner Cloud API client
│   │   ├── zoho.ts                   # Zoho Mail API client
│   │   └── ssl.ts                    # SSL certificate issuance
│   └── email/
│       └── sendAdminNotification.ts  # Admin notification emails
│
├── locales/                          # i18n translation files
│   ├── en.ts                         # English (source of truth)
│   ├── so.ts                         # Somali
│   ├── ar.ts                         # Arabic
│   └── index.ts                      # Re-exports + TypeScript types
│
├── public/                           # Static files
│   ├── videos/coding.mp4             # Hero background video
│   ├── images/                       # Project and service images
│   ├── logo.png / logoB.png / logoW.png
│   └── robots.txt
│
├── styles/
│   └── globals.css                   # Tailwind base + global styles
│
├── supabase/
│   └── migrations/                   # RLS migration SQL files
│
├── scripts/
│   └── create-stripe-coupon.ts       # One-off script for Stripe coupon
│
├── middleware.ts                     # Edge middleware for /admin/* protection
├── supabase_setup.sql                # Full database setup SQL
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
└── package.json
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```bash
# App
NEXT_PUBLIC_SITE_URL=https://raygalroyal.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin
ADMIN_EMAILS=admin@yourdomain.com
# For multiple admins: ADMIN_EMAILS=admin1@example.com,admin2@example.com

# Stripe (service packages)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ENTERPRISE=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend)
RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL=Raygal Royal <noreply@yourdomain.com>

# Domain (Namecheap)
NEXT_PUBLIC_NAMECHEAP_AFFILIATE_URL=https://namecheap.pxf.io/c/...
NAMECHEAP_API_USER=your-username
NAMECHEAP_API_KEY=your-api-key
NAMECHEAP_USERNAME=your-username
NAMECHEAP_CLIENT_IP=your-server-ip

# Domain add-ons provisioning (optional)
HETZNER_API_TOKEN=...
ZOHO_API_KEY=...
```

**Notes:**
- `NEXT_PUBLIC_*` variables are exposed to the browser — never put secrets here
- Without `NAMECHEAP_API_KEY`, the domain checker falls back to scraping Namecheap's public results page
- Without `STRIPE_SECRET_KEY`, the payment routes will fail
- Without `RESEND_API_KEY`, contact form and confirmation emails are silently skipped

---

## Installation & Setup

### Prerequisites

- Node.js v18+
- npm or compatible package manager
- A Supabase project
- A Stripe account (for payments)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.local.example .env.local
# Fill in your values

# 3. Initialize the database
# Copy the contents of supabase_setup.sql into the Supabase SQL Editor and run it.
# This creates all tables, indexes, and RLS policies.

# 4. Run the RLS migration
# Copy supabase/migrations/20260509000000_fix_rls_policies.sql and run it too.

# 5. Start development server
npm run dev
# App runs at http://localhost:3000

# 6. Start with Turbopack (faster)
npm run dev  # uses --webpack by default on Windows; remove flag for Turbopack
```

### Test pages

| URL | Description |
|---|---|
| `http://localhost:3000` | Homepage |
| `http://localhost:3000/domain-search` | Domain search |
| `http://localhost:3000/freelancers` | Public freelancer directory |
| `http://localhost:3000/admin/login` | Admin login |
| `http://localhost:3000/freelancer/login` | Freelancer login |

---

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com/new)
3. Add all environment variables from `.env.local`
4. Deploy — Vercel auto-detects Next.js

### Stripe Webhooks

After deploying, register your webhook endpoint in the Stripe dashboard:

- Endpoint URL: `https://raygalroyal.com/api/payment/webhook`
- Events: `checkout.session.completed`
- Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

### Build commands

```bash
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```
