-- SQL for creating project_orders table and setting up policies.
-- Run this in the Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS project_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  plan text,
  description text,
  file_url text,
  customer_email text,
  service text,
  language text,
  status text DEFAULT 'pending',
  amount numeric,
  custom_amount numeric,
  currency text DEFAULT 'USD',
  provider text,
  payment_id text,
  created_at timestamp WITH TIME ZONE DEFAULT now(),
  updated_at timestamp WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE project_orders ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts from anyone (public/anon)
DROP POLICY IF EXISTS "Allow public order insert" ON project_orders;
CREATE POLICY "Allow public order insert"
ON project_orders
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Allow updates from anyone (needed to update payment info)
DROP POLICY IF EXISTS "Allow public order update" ON project_orders;
CREATE POLICY "Allow public order update"
ON project_orders
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Policy: Allow selects from anyone (needed for success page)
DROP POLICY IF EXISTS "Allow public order select" ON project_orders;
CREATE POLICY "Allow public order select"
ON project_orders
FOR SELECT
TO anon
USING (true);

-- Migration safety block for existing databases that were created without updated_at.
ALTER TABLE project_orders
ADD COLUMN IF NOT EXISTS updated_at timestamp WITH TIME ZONE DEFAULT now();

ALTER TABLE project_orders
ADD COLUMN IF NOT EXISTS custom_amount numeric;

CREATE OR REPLACE FUNCTION set_project_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_project_orders_updated_at ON project_orders;
CREATE TRIGGER trg_project_orders_updated_at
BEFORE UPDATE ON project_orders
FOR EACH ROW
EXECUTE FUNCTION set_project_orders_updated_at();

-- Single custom table for freelancer workflow.
DROP TABLE IF EXISTS freelancer_applications;

CREATE TABLE IF NOT EXISTS freelancers (
  id bigserial PRIMARY KEY,
  user_id uuid,
  name text NOT NULL,
  role text,
  bio text,
  profile_image text,
  phone text,
  github text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp WITH TIME ZONE DEFAULT now(),
  title_en text,
  title_so text,
  title_ar text,
  bio_en text,
  bio_so text,
  bio_ar text,
  email text NOT NULL,
  message text NOT NULL DEFAULT ''
);

ALTER TABLE freelancers
ADD COLUMN IF NOT EXISTS user_id uuid;

ALTER TABLE freelancers
ADD COLUMN IF NOT EXISTS bio text;

ALTER TABLE freelancers
ADD COLUMN IF NOT EXISTS profile_image text;

ALTER TABLE freelancers
ADD COLUMN IF NOT EXISTS phone text;

ALTER TABLE freelancers
ADD COLUMN IF NOT EXISTS github text;

ALTER TABLE freelancers
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

ALTER TABLE freelancers
ADD COLUMN IF NOT EXISTS created_at timestamp WITH TIME ZONE DEFAULT now();

ALTER TABLE freelancers
ADD COLUMN IF NOT EXISTS message text NOT NULL DEFAULT '';

ALTER TABLE freelancers
ADD COLUMN IF NOT EXISTS title_en text;

ALTER TABLE freelancers
ADD COLUMN IF NOT EXISTS title_so text;

ALTER TABLE freelancers
ADD COLUMN IF NOT EXISTS title_ar text;

ALTER TABLE freelancers
ADD COLUMN IF NOT EXISTS bio_en text;

ALTER TABLE freelancers
ADD COLUMN IF NOT EXISTS bio_so text;

ALTER TABLE freelancers
ADD COLUMN IF NOT EXISTS bio_ar text;

ALTER TABLE freelancers
ADD COLUMN IF NOT EXISTS email text NOT NULL DEFAULT '';

ALTER TABLE freelancers
DROP COLUMN IF EXISTS image_url;

ALTER TABLE freelancers
DROP COLUMN IF EXISTS linkedin_url;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'freelancers'
      AND constraint_name = 'freelancers_user_id_fkey'
  ) THEN
    ALTER TABLE freelancers
    ADD CONSTRAINT freelancers_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Allow creating freelancer accounts before profile details are completed.
ALTER TABLE freelancers
ALTER COLUMN role DROP NOT NULL;

ALTER TABLE freelancers
ALTER COLUMN bio DROP NOT NULL;

ALTER TABLE freelancers
ALTER COLUMN phone DROP NOT NULL;

ALTER TABLE freelancers
ALTER COLUMN github DROP NOT NULL;

-- Safe backfill for existing records.
UPDATE freelancers
SET
  bio = COALESCE(NULLIF(bio, ''), message),
  title_en = COALESCE(NULLIF(title_en, ''), role),
  title_so = COALESCE(NULLIF(title_so, ''), role),
  title_ar = COALESCE(NULLIF(title_ar, ''), role)
WHERE
  bio IS NULL OR bio = '' OR
  title_en IS NULL OR title_en = '' OR
  title_so IS NULL OR title_so = '' OR
  title_ar IS NULL OR title_ar = '';

ALTER TABLE freelancers ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  message text NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read approved freelancers" ON freelancers;
CREATE POLICY "Public can read approved freelancers"
ON freelancers
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

DROP POLICY IF EXISTS "Freelancers can insert own profile" ON freelancers;
CREATE POLICY "Freelancers can insert own profile"
ON freelancers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Freelancers can update own profile" ON freelancers;
CREATE POLICY "Freelancers can update own profile"
ON freelancers
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Freelancers can delete own profile" ON freelancers;
CREATE POLICY "Freelancers can delete own profile"
ON freelancers
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own messages" ON messages;
CREATE POLICY "Users can read own messages"
ON messages
FOR SELECT
TO authenticated
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can send own messages" ON messages;
CREATE POLICY "Users can send own messages"
ON messages
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

-- Table for moderated client testimonials workflow.
CREATE TABLE IF NOT EXISTS reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  message_en text,
  message_so text,
  message_ar text,
  message text NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  admin_response text,
  admin_response_en text,
  admin_response_so text,
  admin_response_ar text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS message_en text;

ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS message_so text;

ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS message_ar text;

ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS admin_response_en text;

ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS admin_response_so text;

ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS admin_response_ar text;

-- Safe backfill for existing records.
UPDATE reviews
SET
  message_en = COALESCE(NULLIF(message_en, ''), message),
  message_so = COALESCE(NULLIF(message_so, ''), message),
  message_ar = COALESCE(NULLIF(message_ar, ''), message),
  admin_response_en = CASE
    WHEN admin_response IS NULL OR admin_response = '' THEN admin_response_en
    ELSE COALESCE(NULLIF(admin_response_en, ''), admin_response)
  END,
  admin_response_so = CASE
    WHEN admin_response IS NULL OR admin_response = '' THEN admin_response_so
    ELSE COALESCE(NULLIF(admin_response_so, ''), admin_response)
  END,
  admin_response_ar = CASE
    WHEN admin_response IS NULL OR admin_response = '' THEN admin_response_ar
    ELSE COALESCE(NULLIF(admin_response_ar, ''), admin_response)
  END
WHERE
  message_en IS NULL OR message_en = '' OR
  message_so IS NULL OR message_so = '' OR
  message_ar IS NULL OR message_ar = '' OR
  ((admin_response IS NOT NULL AND admin_response <> '') AND (
    admin_response_en IS NULL OR admin_response_en = '' OR
    admin_response_so IS NULL OR admin_response_so = '' OR
    admin_response_ar IS NULL OR admin_response_ar = ''
  ));

-- Phase 2/3 SaaS domain commerce tables.
CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  domain text NOT NULL,
  price numeric NOT NULL,
  user_email text NOT NULL,
  payment_provider text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_id text,
  currency text DEFAULT 'USD',
  total_price numeric,
  customer_name text,
  extras jsonb DEFAULT '{}'::jsonb,
  registrar_order_id text,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_domain_paid_or_registered
ON orders (domain)
WHERE status IN ('paid', 'registered');

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE TABLE IF NOT EXISTS hosting_accounts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  domain text NOT NULL,
  server_id text NOT NULL,
  plan text NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_hosting_accounts_domain ON hosting_accounts(domain);

CREATE TABLE IF NOT EXISTS email_accounts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  domain text NOT NULL,
  email_address text NOT NULL,
  provider text NOT NULL DEFAULT 'zoho',
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_email_accounts_email_address ON email_accounts(email_address);

CREATE TABLE IF NOT EXISTS ssl_certificates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  domain text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  issued_at timestamp WITH TIME ZONE,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ssl_certificates_domain ON ssl_certificates(domain);

-- Optional demand tracking for affiliate launch phase.
CREATE TABLE IF NOT EXISTS domain_search_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  domain text NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_domain_search_logs_domain ON domain_search_logs(domain);
CREATE INDEX IF NOT EXISTS idx_domain_search_logs_created_at ON domain_search_logs(created_at DESC);

-- Backend-managed pricing and visibility for domain-search add-ons.
CREATE TABLE IF NOT EXISTS domain_add_ons (
  id text PRIMARY KEY CHECK (id IN ('ssl', 'hosting', 'email')),
  price numeric NOT NULL CHECK (price >= 0),
  enabled boolean NOT NULL DEFAULT true,
  updated_at timestamp WITH TIME ZONE DEFAULT now()
);

INSERT INTO domain_add_ons (id, price, enabled)
VALUES
  ('ssl', 9.99, true),
  ('hosting', 24.99, true),
  ('email', 14.99, true)
ON CONFLICT (id) DO NOTHING;
