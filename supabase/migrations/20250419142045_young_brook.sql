/*
  # Fix Store RLS Policies

  1. Changes
    - Add storage bucket for store logos
    - Enable RLS on storage.objects
    - Add policies for store logo management
    - Update stores table policies for merchant access

  2. Security
    - Enable RLS on storage.objects
    - Add policy for merchants to manage their store logos
    - Update store policies to allow merchants to manage their stores
*/

-- Create storage bucket for store logos if it doesn't exist
INSERT INTO storage.buckets (id, name)
SELECT 'store-logos', 'store-logos'
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'store-logos'
);

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Add storage policies for store logos
CREATE POLICY "Merchants can upload their store logos"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'store-logos' AND 
  (
    -- Extract merchant ID from path (format: merchant_id/logo.ext)
    SPLIT_PART(name, '/', 1) = auth.uid()::text
  )
)
WITH CHECK (
  bucket_id = 'store-logos' AND 
  (
    SPLIT_PART(name, '/', 1) = auth.uid()::text
  )
);

-- Update stores table policies
DO $$ 
BEGIN
  -- Drop existing conflicting policies if they exist
  DROP POLICY IF EXISTS "Merchants can create their store" ON stores;
  DROP POLICY IF EXISTS "Merchants can read their store" ON stores;
  DROP POLICY IF EXISTS "Merchants can update their store" ON stores;
END $$;

-- Add comprehensive store management policies
CREATE POLICY "Merchants can manage their stores"
ON stores
FOR ALL
TO authenticated
USING (merchant_id = auth.uid())
WITH CHECK (merchant_id = auth.uid());