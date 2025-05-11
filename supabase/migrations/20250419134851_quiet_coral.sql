/*
  # Create storage bucket for store logos

  1. New Storage Bucket
    - Creates a new public storage bucket named 'store-logos'
    - Used for storing merchant store logo images
  
  2. Security
    - Enable public access for reading logos
    - Allow authenticated users to upload and manage their store logos
*/

-- Create the storage bucket for store logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('store-logos', 'store-logos', true);

-- Policy to allow public access to read logos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'store-logos');

-- Policy to allow authenticated users to upload and manage their store logos
CREATE POLICY "Authenticated users can upload store logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'store-logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own store logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'store-logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
) WITH CHECK (
  bucket_id = 'store-logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own store logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'store-logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);