/*
  # Add Store Fields Migration

  1. Changes
    - Add category and additional_details fields to stores table
    - Update existing store management policies

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to stores table
ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS additional_details text;