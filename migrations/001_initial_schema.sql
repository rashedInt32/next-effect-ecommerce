-- Migration: 001_initial_schema
-- Created: 2026-02-08

-- Enable UUID extension (optional but good practice)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL CHECK (price > 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url VARCHAR(500),
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for category lookups
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Carts table
CREATE TABLE IF NOT EXISTS carts (
  id VARCHAR(255) PRIMARY KEY,
  visitor_id VARCHAR(255) NOT NULL,
  total INTEGER NOT NULL DEFAULT 0 CHECK (total >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for visitor lookups
CREATE INDEX IF NOT EXISTS idx_carts_visitor ON carts(visitor_id);

-- Cart items table (junction table between carts and products)
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  cart_id VARCHAR(255) NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id VARCHAR(255) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price INTEGER NOT NULL CHECK (price > 0),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(cart_id, product_id)
);

-- Create indexes for cart items
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product ON cart_items(product_id);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(255) PRIMARY KEY,
  visitor_id VARCHAR(255) NOT NULL,
  total INTEGER NOT NULL CHECK (total > 0),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for visitor orders
CREATE INDEX IF NOT EXISTS idx_orders_visitor ON orders(visitor_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Order items table (junction table between orders and products)
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(255) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(255) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price INTEGER NOT NULL CHECK (price > 0),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for order items
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- Insert sample products for testing
INSERT INTO products (id, name, description, price, stock, image_url, category, created_at) VALUES
('prod_001', 'Wireless Bluetooth Headphones', 'Premium noise-cancelling headphones with 30-hour battery life', 7999, 45, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', 'electronics', '2025-01-15T10:30:00Z'),
('prod_002', 'Minimalist Leather Wallet', 'Slim genuine leather wallet with RFID protection', 4999, 120, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop', 'accessories', '2025-01-14T08:00:00Z'),
('prod_003', 'Smart Fitness Watch', 'Track your health with heart rate monitor and GPS', 19999, 30, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop', 'electronics', '2025-01-13T14:20:00Z'),
('prod_004', 'Organic Cotton T-Shirt', 'Comfortable everyday tee made from 100% organic cotton', 2999, 200, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop', 'clothing', '2025-01-12T09:45:00Z'),
('prod_005', 'Portable Bluetooth Speaker', 'Waterproof speaker with 360° sound and 12-hour battery', 8999, 75, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop', 'electronics', '2025-01-11T16:30:00Z'),
('prod_006', 'Stainless Steel Water Bottle', 'Insulated bottle keeps drinks cold 24hrs or hot 12hrs', 3499, 150, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop', 'lifestyle', '2025-01-10T11:15:00Z'),
('prod_007', 'Mechanical Keyboard', 'RGB backlit keyboard with cherry MX switches', 12999, 40, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&h=500&fit=crop', 'electronics', '2025-01-09T13:00:00Z'),
('prod_008', 'Canvas Backpack', 'Durable backpack with laptop compartment and USB port', 5999, 85, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop', 'accessories', '2025-01-08T10:00:00Z');
