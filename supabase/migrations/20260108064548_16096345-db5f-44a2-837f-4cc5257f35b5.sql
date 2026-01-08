-- Add content length constraint and rate limiting for comments
ALTER TABLE public.comments 
ADD CONSTRAINT comment_length_limit 
CHECK (length(content) <= 5000 AND length(trim(content)) > 0);

-- Update existing policy to add rate limiting (max 50 comments per hour per user)
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;

CREATE POLICY "Authenticated users can create comments with rate limit"
  ON public.comments
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    (SELECT COUNT(*) FROM public.comments 
     WHERE user_id = auth.uid() 
     AND created_at > NOW() - INTERVAL '1 hour') < 50
  );