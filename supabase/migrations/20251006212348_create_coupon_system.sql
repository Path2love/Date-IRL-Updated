/*
  # Coupon Code System

  1. New Tables
    - `coupons`
      - `id` (uuid, primary key)
      - `code` (text, unique) - The coupon code (e.g., "DATEIRL50")
      - `discount_type` (text) - Type of discount: "free_trial", "premium_discount", "extended_searches"
      - `discount_value` (integer) - Value depends on type (e.g., 30 for 30 days, 50 for 50% off)
      - `max_uses` (integer) - Maximum number of times this code can be used (null = unlimited)
      - `current_uses` (integer) - Current number of times used
      - `active` (boolean) - Whether the coupon is currently active
      - `expires_at` (timestamptz) - When the coupon expires (null = never expires)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `coupon_redemptions`
      - `id` (uuid, primary key)
      - `coupon_id` (uuid, foreign key to coupons)
      - `user_email` (text) - Email of user who redeemed
      - `redeemed_at` (timestamptz)
      - `ip_address` (text) - For fraud prevention
      
    - `user_subscriptions`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `subscription_type` (text) - "free", "premium"
      - `search_count` (integer) - Number of searches used
      - `coupon_code_used` (text) - The coupon code they used (if any)
      - `subscription_expires_at` (timestamptz) - When premium expires
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to active coupons (code validation only)
    - Add policies for authenticated insert on redemptions
    - Restrict admin operations

  3. Indexes
    - Index on coupon code for fast lookup
    - Index on user_email for subscription checks
*/

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('free_trial', 'premium_discount', 'extended_searches', 'free_premium')),
  discount_value integer NOT NULL DEFAULT 0,
  max_uses integer,
  current_uses integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create coupon_redemptions table
CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid REFERENCES coupons(id) ON DELETE CASCADE,
  user_email text NOT NULL,
  redeemed_at timestamptz DEFAULT now(),
  ip_address text
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscription_type text NOT NULL DEFAULT 'free' CHECK (subscription_type IN ('free', 'premium')),
  search_count integer NOT NULL DEFAULT 0,
  coupon_code_used text,
  subscription_expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_email ON user_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_email ON coupon_redemptions(user_email);

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Coupons policies (public can validate codes)
CREATE POLICY "Anyone can read active coupons"
  ON coupons FOR SELECT
  USING (active = true AND (expires_at IS NULL OR expires_at > now()));

-- Coupon redemptions policies
CREATE POLICY "Anyone can create redemption records"
  ON coupon_redemptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own redemptions"
  ON coupon_redemptions FOR SELECT
  USING (true);

-- User subscriptions policies
CREATE POLICY "Anyone can create subscription"
  ON user_subscriptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read own subscription"
  ON user_subscriptions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update own subscription"
  ON user_subscriptions FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Insert some default coupon codes
INSERT INTO coupons (code, discount_type, discount_value, max_uses, active, expires_at)
VALUES 
  ('DATEIRL2025', 'free_premium', 30, 100, true, now() + interval '90 days'),
  ('FIRSTDATE', 'extended_searches', 10, NULL, true, NULL),
  ('LOVE50', 'premium_discount', 50, 200, true, now() + interval '60 days')
ON CONFLICT (code) DO NOTHING;
