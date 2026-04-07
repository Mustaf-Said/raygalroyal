# RayGalRoyal Project

A modern Next.js application designed for [describe your project purpose].

## Overview

This project is built with [Next.js](https://nextjs.org), a React framework for production applications.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm, yarn, pnpm, or bun

## Getting Started

### Step 1: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Step 2: Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### Step 3: View Your Application

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Development

- Edit files in `app/page.tsx` to modify pages
- Changes auto-refresh in the browser as you save

The project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to optimize fonts automatically.

## Environment Variables

Create a `.env.local` file with the following values:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Optional but recommended for automatic bucket check/create
SUPABASE_SERVICE_ROLE_KEY=

# Stripe checkout
STRIPE_SECRET_KEY=
STRIPE_PRICE_BASIC=
STRIPE_PRICE_PRO=
STRIPE_PRICE_ENTERPRISE=

# Optional fallbacks
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_PAYPAL_CHECKOUT_URL=

# Namecheap affiliate checkout
# Optional full affiliate base URL (recommended)
# Example: https://namecheap.pxf.io/c/7160302/1632743/5618
NEXT_PUBLIC_NAMECHEAP_AFFILIATE_URL=

# Legacy variable (optional)
NEXT_PUBLIC_NAMECHEAP_AFFILIATE_ID=
```

### Supabase Storage Bucket

The upload flow uses the bucket named `project-files`.

- If `SUPABASE_SERVICE_ROLE_KEY` is configured, the app will verify/create this bucket via `POST /api/supabase/ensure-storage-bucket` before upload.
- If it is not configured, create the bucket manually in Supabase Storage with the exact name `project-files`.

## Learn More

- “Webpack is used for local development to avoid Turbopack issues on Windows.”
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub Repository](https://github.com/vercel/next.js)

## Deployment

Deploy on [Vercel Platform](https://vercel.com) - the official Next.js hosting solution. See [deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for details.
