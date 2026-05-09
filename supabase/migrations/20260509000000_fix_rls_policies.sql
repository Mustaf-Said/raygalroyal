-- =============================================================================
-- Migration: Enable Row Level Security on 7 public tables
-- Created: 2026-05-09
-- =============================================================================
--
-- SAFETY NOTE: Every backend API route that reads/writes these tables uses
-- SUPABASE_SERVICE_ROLE_KEY (via createClient or supabaseAdmin), which
-- bypasses RLS entirely. These policies therefore have zero impact on existing
-- API behaviour — they only close the window for direct anon/authenticated
-- Supabase client calls that could otherwise bypass the API layer.
--
-- Admin identity check used throughout (matches lib/requestAuth.ts and
-- lib/adminAuth.ts server-side logic):
--
--   (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
--
-- Note: ADMIN_EMAILS env-var logic cannot be replicated in SQL; the
-- app_metadata.role check is the RLS equivalent.  Admin users who are
-- identified only by ADMIN_EMAILS (and whose app_metadata.role is not set
-- to 'admin') will NOT satisfy the SQL admin check for direct DB access.
-- All production admin operations go through the API layer (SERVICE_ROLE_KEY)
-- so this is not a functional limitation.
-- =============================================================================


-- =============================================================================
-- 1. public.orders  (domain purchase orders)
-- =============================================================================
-- Schema: id, domain, price, user_email, payment_provider, status, payment_id,
--         currency, total_price, customer_name, extras, registrar_order_id,
--         created_at
-- Ownership: user_email (no auth.uid() link — customers need no Supabase account)
--
-- Backend routes using SERVICE_ROLE_KEY (RLS bypassed):
--   lib/domain/commerce.ts        createPendingDomainOrder()   → INSERT
--   lib/domain/commerce.ts        markDomainOrderPaid()        → UPDATE
--   lib/domain/commerce.ts        getDomainOrderById()         → SELECT
--   POST /api/payment/webhook     fulfillPaidOrder()           → SELECT + UPDATE
--
-- Policy decisions:
--   SELECT  — authenticated user matching user_email sees own orders;
--             admin sees all. Anon: denied.
--   INSERT  — denied for direct clients (backend-only via SERVICE_ROLE_KEY).
--   UPDATE  — denied for direct clients.
--   DELETE  — denied for direct clients.
-- =============================================================================

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own domain orders" ON public.orders;
CREATE POLICY "Users can view own domain orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  user_email = auth.email()
  OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- No INSERT / UPDATE / DELETE policies → these operations are denied for all
-- direct clients.  The backend (SERVICE_ROLE_KEY) is unaffected.


-- =============================================================================
-- 2. public.hosting_accounts  (Hetzner server records)
-- =============================================================================
-- Schema: id, domain, server_id, plan, created_at
-- Ownership: none (linked to domain string only — no user_id / user_email)
--
-- Backend routes using SERVICE_ROLE_KEY (RLS bypassed):
--   lib/domain/commerce.ts        provisionHostingForOrder()   → SELECT + INSERT
--   POST /api/hosting/create      createHetznerHostingServer() → INSERT
--
-- Policy decision: admin-only for all operations; deny everyone else.
-- =============================================================================

ALTER TABLE public.hosting_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage hosting accounts" ON public.hosting_accounts;
CREATE POLICY "Admins can manage hosting accounts"
ON public.hosting_accounts
FOR ALL
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);


-- =============================================================================
-- 3. public.email_accounts  (Zoho mailbox records)
-- =============================================================================
-- Schema: id, domain, email_address, provider, created_at
-- Ownership: none (linked to domain / email_address — no user_id)
--
-- Backend routes using SERVICE_ROLE_KEY (RLS bypassed):
--   lib/domain/commerce.ts        provisionEmailForOrder()     → SELECT + INSERT
--   POST /api/email/create        createZohoMailbox()          → INSERT
--
-- Policy decision: admin-only for all operations.
-- =============================================================================

ALTER TABLE public.email_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage email accounts" ON public.email_accounts;
CREATE POLICY "Admins can manage email accounts"
ON public.email_accounts
FOR ALL
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);


-- =============================================================================
-- 4. public.ssl_certificates  (SSL issuance records)
-- =============================================================================
-- Schema: id, domain, status, issued_at, created_at
-- Ownership: none (linked to domain string only)
--
-- Backend routes using SERVICE_ROLE_KEY (RLS bypassed):
--   lib/domain/commerce.ts        provisionSslForOrder()       → SELECT + INSERT
--   POST /api/ssl/create          issueSslCertificate()        → INSERT
--
-- Policy decision: admin-only for all operations.
-- =============================================================================

ALTER TABLE public.ssl_certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage SSL certificates" ON public.ssl_certificates;
CREATE POLICY "Admins can manage SSL certificates"
ON public.ssl_certificates
FOR ALL
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);


-- =============================================================================
-- 5. public.domain_search_logs  (anonymous domain search analytics)
-- =============================================================================
-- Schema: id, domain, created_at
-- Ownership: none (purely analytics — no user identity stored)
--
-- Backend routes using SERVICE_ROLE_KEY (RLS bypassed):
--   POST /api/domain/search-log   supabaseAdmin.insert()       → INSERT
--
-- Policy decisions:
--   INSERT  — allow anon + authenticated (public domain search form; the
--             backend currently uses SERVICE_ROLE_KEY but the policy permits
--             future client-side logging without breaking anything).
--   SELECT  — admin only (analytics data must not be publicly readable).
--   UPDATE / DELETE — denied for direct clients.
-- =============================================================================

ALTER TABLE public.domain_search_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can log domain searches" ON public.domain_search_logs;
CREATE POLICY "Anyone can log domain searches"
ON public.domain_search_logs
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read domain search logs" ON public.domain_search_logs;
CREATE POLICY "Admins can read domain search logs"
ON public.domain_search_logs
FOR SELECT
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- No UPDATE / DELETE policies → denied for all direct clients.


-- =============================================================================
-- 6. public.reviews  (customer testimonials — moderated before public display)
-- =============================================================================
-- Schema: id, name, message, message_en/so/ar, rating, admin_response,
--         admin_response_en/so/ar, status, created_at
-- Ownership: none — reviews have no user_id (anonymous submission form)
--
-- Backend routes using SERVICE_ROLE_KEY (RLS bypassed):
--   GET  /api/reviews             SELECT approved (status = 'approved')
--   POST /api/reviews             INSERT new review (rate-limited + honeypot)
--   GET  /api/admin/reviews       SELECT all reviews
--   PATCH /api/admin/reviews/[id] UPDATE review (approve, add response)
--
-- Policy decisions:
--   SELECT  — anon + authenticated may read approved reviews only;
--             admin may read all regardless of status.
--   INSERT  — anon + authenticated may submit reviews, but only with
--             status = 'pending' (prevents direct insertion of approved rows).
--             Application-level rate limiting and honeypot in /api/reviews
--             are the primary abuse controls.
--   UPDATE  — admin only (approve, add multilingual response).
--   DELETE  — admin only.
-- =============================================================================

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read approved reviews" ON public.reviews;
CREATE POLICY "Public can read approved reviews"
ON public.reviews
FOR SELECT
TO anon, authenticated
USING (
  status = 'approved'
  OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

DROP POLICY IF EXISTS "Anyone can submit a review" ON public.reviews;
CREATE POLICY "Anyone can submit a review"
ON public.reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending'
);

DROP POLICY IF EXISTS "Admins can update reviews" ON public.reviews;
CREATE POLICY "Admins can update reviews"
ON public.reviews
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;
CREATE POLICY "Admins can delete reviews"
ON public.reviews
FOR DELETE
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);


-- =============================================================================
-- 7. public.domain_add_ons  (pricing + enable/disable for SSL/hosting/email)
-- =============================================================================
-- Schema: id ('ssl'|'hosting'|'email'), price, enabled, updated_at
-- Ownership: none — shared configuration table
--
-- Backend routes using SERVICE_ROLE_KEY (RLS bypassed):
--   GET  /api/domain/add-ons            supabaseAdmin.select()  → SELECT
--   GET  /api/admin/domain-add-ons      supabase.select()       → SELECT
--   PATCH /api/admin/domain-add-ons     supabase.upsert()       → INSERT + UPDATE
--
-- Policy decisions:
--   SELECT  — public (pricing is shown on the public domain search page).
--   INSERT / UPDATE / DELETE — admin only (pricing must only change via admin).
-- =============================================================================

ALTER TABLE public.domain_add_ons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read domain add-on pricing" ON public.domain_add_ons;
CREATE POLICY "Public can read domain add-on pricing"
ON public.domain_add_ons
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can manage domain add-ons" ON public.domain_add_ons;
CREATE POLICY "Admins can manage domain add-ons"
ON public.domain_add_ons
FOR ALL
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
