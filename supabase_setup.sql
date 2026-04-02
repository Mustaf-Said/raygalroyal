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
ADD COLUMN IF NOT EXISTS linkedin_url text NOT NULL DEFAULT 'https://www.linkedin.com';

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

-- Allow creating freelancer accounts before profile/application details are completed.
ALTER TABLE freelancers
ALTER COLUMN image_url DROP NOT NULL;

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
  profile_image = COALESCE(NULLIF(profile_image, ''), image_url),
  github = COALESCE(NULLIF(github, ''), linkedin_url),
  title_en = COALESCE(NULLIF(title_en, ''), role),
  title_so = COALESCE(NULLIF(title_so, ''), role),
  title_ar = COALESCE(NULLIF(title_ar, ''), role),
  bio_en = COALESCE(NULLIF(bio_en, ''), message),
  bio_so = COALESCE(NULLIF(bio_so, ''), message),
  bio_ar = COALESCE(NULLIF(bio_ar, ''), message)
WHERE
  bio IS NULL OR bio = '' OR
  profile_image IS NULL OR profile_image = '' OR
  github IS NULL OR github = '' OR
  title_en IS NULL OR title_en = '' OR
  title_so IS NULL OR title_so = '' OR
  title_ar IS NULL OR title_ar = '' OR
  bio_en IS NULL OR bio_en = '' OR
  bio_so IS NULL OR bio_so = '' OR
  bio_ar IS NULL OR bio_ar = '';

ALTER TABLE freelancer_applications ENABLE ROW LEVEL SECURITY;
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
