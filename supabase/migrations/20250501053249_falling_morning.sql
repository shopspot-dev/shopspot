/*
  # Fix Storage Policies for Store Logos

  1. Changes
    - Simplify storage policies to use proper path comparison
    - Update store management policies
    - Ensure proper bucket configuration

  2. Security
    - Enable RLS on stores table
    - Add policies for merchant store management
    - Add storage policies for logo management
*/

-- First ensure RLS is enabled
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they conflict
DROP POLICY IF EXISTS "Merchants can manage their stores" ON stores;
DROP POLICY IF EXISTS "Users can access their store data" ON stores;

-- Create comprehensive store management policies
CREATE POLICY "Merchants can manage their stores"
ON stores
FOR ALL
TO authenticated
USING (
  merchant_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM merchants 
    WHERE merchants.id = stores.merchant_id 
    AND merchants.user_id = auth.uid()
  )
)
WITH CHECK (
  merchant_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM merchants 
    WHERE merchants.id = stores.merchant_id 
    AND merchants.user_id = auth.uid()
  )
);

-- Storage policies for store logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('store-logos', 'store-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Merchants can upload store logos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view store logos" ON storage.objects;
DROP POLICY IF EXISTS "Merchants can manage store logos" ON storage.objects;

-- Create a single comprehensive policy for merchants to manage their logos
CREATE POLICY "Merchants can manage store logos"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'store-logos' AND
  (
    -- Allow access if the path starts with the user's ID or merchant ID
    SPLIT_PART(name, '/', 1) = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.user_id = auth.uid()
      AND SPLIT_PART(name, '/', 1) = merchants.id::text
    )
  )
)
WITH CHECK (
  bucket_id = 'store-logos' AND
  (
    -- Allow upload if the path starts with the user's ID or merchant ID
    SPLIT_PART(name, '/', 1) = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.user_id = auth.uid()
      AND SPLIT_PART(name, '/', 1) = merchants.id::text
    )
  )
);

-- Allow public access to view store logos
CREATE POLICY "Public can view store logos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'store-logos');