/*
  # Initial Schema Setup for Merchant Dashboard

  1. Tables Created:
    - merchants: Store basic merchant information
    - stores: Store profiles and settings
    - menu_items: Product catalog
    - categories: Menu item categories
    - orders: Customer orders
    - order_items: Individual items in orders
    - users: Store staff accounts
    - payments: Payment records
    - settings: Store-specific settings

  2. Security:
    - RLS policies for each table
    - Authentication using built-in auth
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Merchants table
CREATE TABLE IF NOT EXISTS merchants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id uuid REFERENCES merchants(id),
  name text NOT NULL,
  description text,
  logo_url text,
  address text,
  phone text,
  email text,
  tax_rate numeric(5,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Store hours
CREATE TABLE IF NOT EXISTS store_hours (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id uuid REFERENCES stores(id),
  day_of_week text NOT NULL,
  open_time time,
  close_time time,
  is_closed boolean DEFAULT false,
  UNIQUE(store_id, day_of_week)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id uuid REFERENCES stores(id),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(store_id, name)
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id uuid REFERENCES stores(id),
  category_id uuid REFERENCES categories(id),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  image_url text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id uuid REFERENCES stores(id),
  customer_name text NOT NULL,
  customer_email text,
  status text DEFAULT 'pending',
  total_amount numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id),
  menu_item_id uuid REFERENCES menu_items(id),
  quantity integer NOT NULL,
  price_at_time numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id uuid REFERENCES stores(id),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'staff',
  last_login timestamptz,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Store settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id uuid REFERENCES stores(id) UNIQUE,
  notification_email boolean DEFAULT true,
  notification_push boolean DEFAULT true,
  notification_sms boolean DEFAULT false,
  auto_accept_orders boolean DEFAULT false,
  preparation_time integer DEFAULT 20,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id uuid REFERENCES stores(id),
  order_id uuid REFERENCES orders(id),
  amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending',
  payment_method text,
  stripe_payment_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Merchants can access their own data"
  ON merchants FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "Users can access their store data"
  ON stores FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.store_id = stores.id
    AND users.id = auth.uid()
  ));

CREATE POLICY "Users can access their store hours"
  ON store_hours FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.store_id = store_hours.store_id
    AND users.id = auth.uid()
  ));

CREATE POLICY "Users can access their store categories"
  ON categories FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.store_id = categories.store_id
    AND users.id = auth.uid()
  ));

CREATE POLICY "Users can access their store menu items"
  ON menu_items FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.store_id = menu_items.store_id
    AND users.id = auth.uid()
  ));

CREATE POLICY "Users can access their store orders"
  ON orders FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.store_id = orders.store_id
    AND users.id = auth.uid()
  ));

CREATE POLICY "Users can access their store order items"
  ON order_items FOR ALL
  USING (EXISTS (
    SELECT 1 FROM orders, users
    WHERE orders.id = order_items.order_id
    AND users.store_id = orders.store_id
    AND users.id = auth.uid()
  ));

CREATE POLICY "Users can access their own user data"
  ON users FOR ALL
  USING (id = auth.uid() OR EXISTS (
    SELECT 1 FROM users u2
    WHERE u2.store_id = users.store_id
    AND u2.id = auth.uid()
    AND u2.role = 'admin'
  ));

CREATE POLICY "Users can access their store settings"
  ON settings FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.store_id = settings.store_id
    AND users.id = auth.uid()
  ));

CREATE POLICY "Users can access their store payments"
  ON payments FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.store_id = payments.store_id
    AND users.id = auth.uid()
  ));