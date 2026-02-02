-- Create popup_notices table for admin-controlled popup notices
CREATE TABLE public.popup_notices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  content TEXT,
  image_url TEXT,
  link_url TEXT,
  display_type TEXT NOT NULL DEFAULT 'both' CHECK (display_type IN ('text', 'image', 'both')),
  is_active BOOLEAN NOT NULL DEFAULT false,
  button_text TEXT DEFAULT 'Learn More',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.popup_notices ENABLE ROW LEVEL SECURITY;

-- Public can read active popup notices
CREATE POLICY "Anyone can view active popup notices"
  ON public.popup_notices
  FOR SELECT
  USING (is_active = true);

-- Only admins can manage popup notices
CREATE POLICY "Admins can manage popup notices"
  ON public.popup_notices
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_popup_notices_updated_at
  BEFORE UPDATE ON public.popup_notices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();