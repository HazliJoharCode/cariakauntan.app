/*
  # Final Shop Permissions Fix

  1. Changes
    - Simplify all shop-related policies
    - Remove any remaining recursive checks
    - Ensure public read access for all necessary tables
    - Fix remaining permission denied errors

  2. Security
    - Maintain proper access control
    - Allow public access to required data
    - Keep admin privileges intact
*/

-- Drop all existing problematic policies
DROP POLICY IF EXISTS "anyone_can_view_published_products" ON products;
DROP POLICY IF EXISTS "admin_manage_products" ON products;
DROP POLICY IF EXISTS "anyone_can_view_variants" ON product_variants;
DROP POLICY IF EXISTS "admin_manage_variants" ON product_variants;
DROP POLICY IF EXISTS "anyone_can_view_images" ON product_images;
DROP POLICY IF EXISTS "admin_manage_images" ON product_images;

-- Create final simplified policies for products
CREATE POLICY "products_public_read"
  ON products
  FOR SELECT
  USING (true);

CREATE POLICY "products_admin_all"
  ON products
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create final simplified policies for product variants
CREATE POLICY "variants_public_read"
  ON product_variants
  FOR SELECT
  USING (true);

CREATE POLICY "variants_admin_all"
  ON product_variants
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create final simplified policies for product images
CREATE POLICY "images_public_read"
  ON product_images
  FOR SELECT
  USING (true);

CREATE POLICY "images_admin_all"
  ON product_images
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create final simplified policies for categories
CREATE POLICY "categories_public_read"
  ON categories
  FOR SELECT
  USING (true);

CREATE POLICY "categories_admin_all"
  ON categories
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );