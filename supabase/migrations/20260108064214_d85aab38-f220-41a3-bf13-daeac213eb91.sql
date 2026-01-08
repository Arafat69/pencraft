-- Drop the existing permissive policy that exposes user activity
DROP POLICY IF EXISTS "Anyone can view like counts" ON public.post_likes;

-- Create a new policy that only allows users to see their own likes
CREATE POLICY "Users can view their own likes"
  ON public.post_likes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create a secure function to get like counts without exposing user_ids
CREATE OR REPLACE FUNCTION public.get_post_like_count(p_post_slug text)
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)
  FROM public.post_likes
  WHERE post_slug = p_post_slug
$$;