-- Add logo column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS logo TEXT DEFAULT NULL;

-- Update trigger for profiles table if needed
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at(); 