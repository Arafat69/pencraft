-- Add secret_keywords column to posts table for hidden search tags
ALTER TABLE public.posts
ADD COLUMN secret_keywords text[] DEFAULT '{}';

-- Add secret_keywords column to products table for hidden search tags
ALTER TABLE public.products
ADD COLUMN secret_keywords text[] DEFAULT '{}';

-- Add comments for documentation
COMMENT ON COLUMN public.posts.secret_keywords IS 'Hidden keywords for search matching, not visible to users';
COMMENT ON COLUMN public.products.secret_keywords IS 'Hidden keywords for search matching, not visible to users';