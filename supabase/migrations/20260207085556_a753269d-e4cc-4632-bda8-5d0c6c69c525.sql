-- Add new columns to orders table for Bangladesh e-commerce
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_name text,
ADD COLUMN IF NOT EXISTS division text,
ADD COLUMN IF NOT EXISTS district text,
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS transaction_id text;