/*
  # Setup menu items storage

  1. New Storage Bucket
    - Creates a new storage bucket for menu item images
    - Sets up public access for reading images
    - Restricts uploads to authenticated users with proper store access

  2. Security
    - Enables RLS on the storage bucket
    - Adds policies for read/write access
*/

-- Create storage bucket for menu items
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-items', 'menu-items', true);

-- Enable RLS on the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to menu item images
CREATE POLICY "Public can view menu item images"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-items');

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload menu item images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'menu-items' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text 
    FROM stores 
    WHERE id IN (
      SELECT store_id 
      FROM users 
      WHERE users.id = auth.uid()
    )
  )
);

-- Create policy to allow users to delete their store's images
CREATE POLICY "Users can delete their store's images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'menu-items' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text 
    FROM stores 
    WHERE id IN (
      SELECT store_id 
      FROM users 
      WHERE users.id = auth.uid()
    )
  )
);