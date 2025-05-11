/*
  # Enhanced Menu Items Schema

  1. New Fields
    - Added preparation_time, stock_quantity, tags, dietary_restrictions
    - Added customization_options and special_instructions
    - Added parent_category_id for hierarchical categories
  
  2. Changes
    - Modified categories table to support hierarchical structure
    - Added item_images table for multiple images per item
*/

-- Add new columns to menu_items
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS preparation_time integer DEFAULT 15;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS stock_quantity integer DEFAULT 0;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS dietary_restrictions text[] DEFAULT '{}';
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS customization_options jsonb DEFAULT '[]';
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS special_instructions text;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS seasonal_availability tstzrange;

-- Add parent_category_id to categories for hierarchical structure
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES categories(id);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS attributes jsonb DEFAULT '{}';

-- Create item_images table
CREATE TABLE IF NOT EXISTS item_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
  url text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(item_id, url)
);

-- Enable RLS on item_images
ALTER TABLE item_images ENABLE ROW LEVEL SECURITY;

-- Create policy for item_images
CREATE POLICY "Users can manage their store item images"
  ON item_images FOR ALL
  USING (EXISTS (
    SELECT 1 FROM menu_items, users
    WHERE menu_items.id = item_images.item_id
    AND users.store_id = menu_items.store_id
    AND users.id = auth.uid()
  ));