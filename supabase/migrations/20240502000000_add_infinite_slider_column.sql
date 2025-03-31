-- Add use_infinite_slider column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS use_infinite_slider boolean DEFAULT false;

-- Create trigger function for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to profiles table if not already present
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add trigger to images table if not already present
DROP TRIGGER IF EXISTS set_images_updated_at ON public.images;
CREATE TRIGGER set_images_updated_at
BEFORE UPDATE ON public.images
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at(); 