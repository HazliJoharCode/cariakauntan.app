/*
  # Add Initial Shop Products

  1. New Data
    - Add "Apparel" category
    - Add T-shirt product with size variants
    - Add Cap product
    
  2. Changes
    - Insert initial product data
    - Add product images
    - Set up variants for t-shirt sizes
*/

-- Insert Apparel category
INSERT INTO categories (name, slug, description)
VALUES (
  'Apparel',
  'apparel',
  'Official CariAkauntan.ai branded clothing and accessories'
);

-- Insert T-shirt product
INSERT INTO products (
  name,
  slug,
  description,
  price,
  stock,
  category_id,
  status
)
VALUES (
  'CariAkauntan.ai Logo T-Shirt',
  'cariakauntan-logo-tshirt',
  'Premium cotton t-shirt featuring the CariAkauntan.ai logo. Available in multiple sizes.',
  20.00,
  100,
  (SELECT id FROM categories WHERE slug = 'apparel'),
  'published'
);

-- Add T-shirt variants
INSERT INTO product_variants (
  product_id,
  name,
  sku,
  price,
  stock,
  attributes
)
SELECT
  (SELECT id FROM products WHERE slug = 'cariakauntan-logo-tshirt'),
  size || ' - CariAkauntan.ai Logo T-Shirt',
  'SHIRT-' || size,
  20.00,
  20,
  jsonb_build_object('size', size)
FROM unnest(ARRAY['S', 'M', 'L', 'XL', 'XXL']) AS size;

-- Insert Cap product
INSERT INTO products (
  name,
  slug,
  description,
  price,
  stock,
  category_id,
  status
)
VALUES (
  'CariAkauntan.ai Baseball Cap',
  'cariakauntan-baseball-cap',
  'Stylish baseball cap with embroidered CariAkauntan.ai logo. One size fits most.',
  8.00,
  50,
  (SELECT id FROM categories WHERE slug = 'apparel'),
  'published'
);

-- Add product images
INSERT INTO product_images (product_id, url, alt_text, position)
VALUES
  (
    (SELECT id FROM products WHERE slug = 'cariakauntan-logo-tshirt'),
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    'CariAkauntan.ai Logo T-Shirt front view',
    1
  ),
  (
    (SELECT id FROM products WHERE slug = 'cariakauntan-logo-tshirt'),
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
    'CariAkauntan.ai Logo T-Shirt back view',
    2
  ),
  (
    (SELECT id FROM products WHERE slug = 'cariakauntan-baseball-cap'),
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800',
    'CariAkauntan.ai Baseball Cap front view',
    1
  ),
  (
    (SELECT id FROM products WHERE slug = 'cariakauntan-baseball-cap'),
    'https://images.unsplash.com/photo-1595642527925-4d41cb781653?w=800',
    'CariAkauntan.ai Baseball Cap side view',
    2
  );