/*
  # Create products and related tables

  1. New Tables
    - products
    - product_variants
    - product_images
    - categories
  
  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for admin write access
*/

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price decimal(10,2) NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  category_id uuid REFERENCES categories(id),
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'archived'))
);

-- Create product variants table
CREATE TABLE product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  sku text NOT NULL UNIQUE,
  price decimal(10,2) NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product images table
CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt_text text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Published products are viewable by everyone"
  ON products FOR SELECT
  USING (status = 'published');

CREATE POLICY "Product variants are viewable by everyone"
  ON product_variants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_variants.product_id
      AND products.status = 'published'
    )
  );

CREATE POLICY "Product images are viewable by everyone"
  ON product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
      AND products.status = 'published'
    )
  );

-- Admin write access policies
CREATE POLICY "Admins can manage categories"
  ON categories
  FOR ALL
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM auth.users
      WHERE id IN (
        SELECT id FROM profiles WHERE is_admin = true
      )
    )
  );

CREATE POLICY "Admins can manage products"
  ON products
  FOR ALL
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM auth.users
      WHERE id IN (
        SELECT id FROM profiles WHERE is_admin = true
      )
    )
  );

CREATE POLICY "Admins can manage product variants"
  ON product_variants
  FOR ALL
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM auth.users
      WHERE id IN (
        SELECT id FROM profiles WHERE is_admin = true
      )
    )
  );

CREATE POLICY "Admins can manage product images"
  ON product_images
  FOR ALL
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM auth.users
      WHERE id IN (
        SELECT id FROM profiles WHERE is_admin = true
      )
    )
  );

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Storage policies for product images
CREATE POLICY "Product images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins can manage product images"
  ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'product-images' AND
    auth.jwt() ->> 'email' IN (
      SELECT email FROM auth.users
      WHERE id IN (
        SELECT id FROM profiles WHERE is_admin = true
      )
    )
  );