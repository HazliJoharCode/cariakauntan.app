/*
  # Fix Shop Permissions

  1. Changes
    - Simplify RLS policies for products and related tables
    - Remove recursive policy checks
    - Add proper public read access
    - Fix admin access policies

  2. Security
    - Ensure public read access for published products
    - Maintain admin write access
    - Fix permission denied errors
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "public_read_products" ON products;
DROP POLICY IF EXISTS "admin_manage_products" ON products;
DROP POLICY IF EXISTS "Product variants are viewable by everyone" ON product_variants;
DROP POLICY IF EXISTS "Product images are viewable by everyone" ON product_images;

-- Create simplified product policies
CREATE POLICY "anyone_can_view_published_products"
  ON products
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "admin_manage_products"
  ON products
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Create simplified product variants policies
CREATE POLICY "anyone_can_view_variants"
  ON product_variants
  FOR SELECT
  USING (true);

CREATE POLICY "admin_manage_variants"
  ON product_variants
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Create simplified product images policies
CREATE POLICY "anyone_can_view_images"
  ON product_images
  FOR SELECT
  USING (true);

CREATE POLICY "admin_manage_images"
  ON product_images
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );