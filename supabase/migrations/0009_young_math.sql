/*
  # Fix Product Table Policies

  1. Changes
    - Add public read access to products table
    - Ensure proper RLS policies for products

  2. Security
    - Allow public read access to published products
    - Maintain admin-only write access
*/

-- Drop existing product policies to start fresh
DROP POLICY IF EXISTS "Published products are viewable by everyone" ON products;

-- Create new simplified read policy for products
CREATE POLICY "public_read_products"
  ON products
  FOR SELECT
  USING (true);

-- Ensure admin write access policy exists
CREATE POLICY "admin_manage_products"
  ON products
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );