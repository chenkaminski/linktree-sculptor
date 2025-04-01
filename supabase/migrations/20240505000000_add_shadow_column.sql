-- Add shadow and shadow_color columns to links table
ALTER TABLE public.links
ADD COLUMN IF NOT EXISTS shadow TEXT DEFAULT NULL;

ALTER TABLE public.links
ADD COLUMN IF NOT EXISTS shadow_color TEXT DEFAULT NULL;

-- Update trigger for links table if needed
DROP TRIGGER IF EXISTS set_links_updated_at ON public.links;
CREATE TRIGGER set_links_updated_at
BEFORE UPDATE ON public.links
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at(); 