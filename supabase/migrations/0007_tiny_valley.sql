/*
  # Fix Profile and Product Policies

  1. Changes
    - Remove recursive profile policies
    - Add simplified admin access policy
    - Add public access policy for profiles
    - Add orders table and policies
    - Add order items table and policies

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "admin_full_access" ON profiles;
DROP POLICY IF EXISTS "public_profiles_access" ON profiles;

-- Create new simplified policies
CREATE POLICY "admin_manage_profiles"
  ON profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email IN (
        SELECT email FROM auth.users u
        INNER JOIN profiles p ON u.id = p.id
        WHERE p.is_admin = true
      )
    )
  );

CREATE POLICY "users_view_own_and_verified_profiles"
  ON profiles
  FOR SELECT
  USING (
    verification_status = 'verified'
    OR id = auth.uid()
  );

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  total_amount decimal(10,2) NOT NULL,
  shipping_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'cancelled'))
);

-- Create order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders ON DELETE CASCADE,
  product_id uuid REFERENCES products ON DELETE RESTRICT,
  variant_id uuid REFERENCES product_variants ON DELETE RESTRICT,
  quantity integer NOT NULL,
  price_at_time decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Order policies
CREATE POLICY "users_manage_own_orders"
  ON orders
  FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "admin_manage_all_orders"
  ON orders
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Order items policies
CREATE POLICY "users_view_own_order_items"
  ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "admin_manage_all_order_items"
  ON order_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );