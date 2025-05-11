/*
  # Add RLS policies for store management

  1. Changes
    - Add RLS policies for stores table to allow merchants to:
      - Create their store
      - Update their store details
    - Add storage bucket policies for store-logos to allow merchants to:
      - Upload their store logo
      - Read their store logo

  2. Security
    - Enable RLS on stores table
    - Add policies for authenticated merchants to manage their store
    - Add storage policies for logo management
*/

-- Enable RLS on stores table (if not already enabled)
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Policy for merchants to create their store
CREATE POLICY "Merchants can create their store"
ON stores
FOR INSERT
TO authenticated
WITH CHECK (merchant_id = auth.uid());

-- Policy for merchants to update their store
CREATE POLICY "Merchants can update their store"
ON stores
FOR UPDATE
TO authenticated
USING (merchant_id = auth.uid())
WITH CHECK (merchant_id = auth.uid());

-- Policy for merchants to read their store
CREATE POLICY "Merchants can read their store"
ON stores
FOR SELECT
TO authenticated
USING (merchant_id = auth.uid());

-- Create store-logos bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name)
  VALUES ('store-logos', 'store-logos')
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Enable RLS on the storage bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for merchants to upload their store logo
CREATE POLICY "Merchants can upload their store logo"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'store-logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy for merchants to update their store logo
CREATE POLICY "Merchants can update their store logo"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'store-logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy for merchants to read their store logo
CREATE POLICY "Merchants can read their store logo"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'store-logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy for public access to store logos
CREATE POLICY "Public can read store logos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'store-logos');