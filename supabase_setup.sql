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

-- Tables for freelancer application approval workflow.
CREATE TABLE IF NOT EXISTS freelancer_applications (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL,
  message text NOT NULL,
  linkedin_url text NOT NULL DEFAULT 'https://www.linkedin.com',
  image_url text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS freelancers (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  image_url text,
  email text NOT NULL,
  linkedin_url text NOT NULL DEFAULT 'https://www.linkedin.com',
  message text NOT NULL DEFAULT ''
);

ALTER TABLE freelancer_applications
ADD COLUMN IF NOT EXISTS linkedin_url text NOT NULL DEFAULT 'https://www.linkedin.com';

ALTER TABLE freelancer_applications
ADD COLUMN IF NOT EXISTS image_url text;

ALTER TABLE freelancers
ADD COLUMN IF NOT EXISTS image_url text;

ALTER TABLE freelancers
ADD COLUMN IF NOT EXISTS linkedin_url text NOT NULL DEFAULT 'https://www.linkedin.com';

ALTER TABLE freelancers
ADD COLUMN IF NOT EXISTS message text NOT NULL DEFAULT '';

ALTER TABLE freelancer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE freelancers ENABLE ROW LEVEL SECURITY;
