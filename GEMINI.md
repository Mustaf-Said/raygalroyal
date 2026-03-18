I need a full audit and fix of my payment system. The stack is Next.js (App Router), TypeScript, TailwindCSS, Supabase (database), and Stripe + PayPal for payments. The app also supports multilingual content (English ↔ Somali).

---

### 🔴 Current Critical Issues

1. **Amount is always 0 or null**
   - Stripe/PayPal checkout shows correct price
   - But Supabase stores `amount = null` or `0`
   - UI shows `$0.00`

2. **Currency inconsistency**
   - Some plans use USD, others SEK incorrectly
   - Currency is not consistent between UI, Stripe, and database

3. **Customer email issue**
   - User enters email at the beginning
   - But Stripe checkout shows my own email (likely hardcoded or reused)
   - Correct customer email is not passed or saved

4. **Database not updating**
   - Orders remain:
     - status: "pending"
     - amount: null
     - currency: null

   - No update after successful payment

5. **No confirmation email**
   - Customer does NOT receive email after successful payment

6. **PayPal vs Stripe inconsistency**
   - Different logic between providers
   - Amount handling is inconsistent

7. **Possible hardcoded values**
   - Email and/or currency might be hardcoded

---

### 🟡 Pricing Logic (IMPORTANT REQUIREMENT)

#### UI (Frontend display)

- Basic → `$1499`
- Professional → `$2999`
- Enterprise → **"Custom"**

👉 “Custom” is ONLY for display — not for payment logic

---

### 💳 Payment Logic (CRITICAL)

When user clicks **Enterprise (Custom)**:

- If language = **Somali (so)**:
  - Amount = **5000**
  - Currency = **USD**

- If language = **English (en)**:
  - Amount = **50000**
  - Currency = **SEK**

👉 This must be handled dynamically in backend
👉 DO NOT send "Custom" as price

---

### 🟢 Additional UI Requirement (Dual Currency Display)

Show both currencies in UI for clarity:

Examples:

- Basic → `$1499 (~16,000 SEK)`
- Pro → `$2999 (~32,000 SEK)`
- Enterprise → `Custom (from $5000 / ~50,000 SEK)`

Rules:

- USD is base price
- SEK is approximate conversion
- Conversion is frontend-only (not used in Stripe)

---

### 🟢 What I Need You To Do

Perform a full end-to-end audit and fix:

---

#### 1. Backend (API routes)

- Fix checkout logic for Stripe & PayPal
- Ensure:
  - Correct `amount` and `currency`
  - Correct `customer_email`
  - No hardcoded values

- Handle Enterprise pricing dynamically based on language

---

#### 2. Stripe Integration

- Remove dependency on static `priceId` for Enterprise
- Use dynamic `price_data` instead
- Pass correct `customer_email`
- Add/fix webhook:
  - On `checkout.session.completed`:
    - Update Supabase:
      - amount = session.amount_total / 100
      - currency = session.currency
      - status = "paid"

---

#### 3. PayPal Integration

- Ensure amount matches backend logic
- Sync success response with Supabase

---

#### 4. Supabase Database

- Audit `project_orders` table
- Ensure correct updates:
  - amount
  - currency
  - status
  - payment_id

- Fix issue where data is not saved

---

#### 5. Frontend (UI / Success Modal)

- Display correct:
  - amount
  - currency

- Fix `$0.00` issue
- Implement dual currency display
- Ensure "Custom" is never used as real price

---

#### 6. Currency Conversion (Frontend)

- Implement simple conversion:
  - Example: 1 USD ≈ 10.5 SEK

- Use only for display

---

#### 7. Email System

- Send confirmation email after successful payment
- Use `customer_email` from database
- Trigger after successful payment (prefer webhook)

---

### ⚠️ Important Rules

- NEVER trust frontend for payment data
- All final payment data must come from Stripe/PayPal or webhook
- DO NOT hardcode email or currency
- Keep Stripe, PayPal, database, and UI fully consistent

---

### 🎯 Goal

A fully working production-ready payment system where:

- Payments work correctly
- Database updates correctly
- No `amount = 0` issues
- Customer email is correct
- Confirmation email is sent
- Enterprise plan works as "Custom" in UI but correct price in backend
- Dual currency display works cleanly

---

Please review all relevant files (API routes, components, Supabase queries, Stripe/PayPal logic) and fix everything systematically.
