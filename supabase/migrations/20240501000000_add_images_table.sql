-- Create images table for storing user image data
CREATE TABLE IF NOT EXISTS public.images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT NOT NULL DEFAULT '',
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Give access to the authenticated users to their own images
CREATE POLICY "Users can create their own images"
ON public.images FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own images"
ON public.images FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images"
ON public.images FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own images"
ON public.images FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Public read access for images"
ON public.images FOR SELECT TO anon
USING (true);

-- Enable RLS
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- Add storage bucket for slider images if it doesn't exist already
INSERT INTO storage.buckets (id, name)
VALUES ('avatars', 'avatars')
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to the bucket
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to update their own image objects
CREATE POLICY "Allow authenticated users to update their images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own image objects
CREATE POLICY "Allow authenticated users to delete their images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public access to read images
CREATE POLICY "Allow public to read images"
ON storage.objects FOR SELECT TO anon
USING (bucket_id = 'avatars'); 