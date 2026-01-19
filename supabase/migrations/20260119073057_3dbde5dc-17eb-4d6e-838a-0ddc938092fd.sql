-- Create product_images table for multiple images per product
CREATE TABLE public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Create policies - Anyone can view product images
CREATE POLICY "Anyone can view product images" 
ON public.product_images 
FOR SELECT 
USING (true);

-- Only authenticated users can manage product images (admins will handle this)
CREATE POLICY "Authenticated users can insert product images" 
ON public.product_images 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update product images" 
ON public.product_images 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete product images" 
ON public.product_images 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create index for faster lookups
CREATE INDEX idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX idx_product_images_display_order ON public.product_images(display_order);