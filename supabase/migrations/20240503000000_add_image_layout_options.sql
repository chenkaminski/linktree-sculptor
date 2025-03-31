-- Add image layout columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS image_layout VARCHAR(20) DEFAULT 'row',
ADD COLUMN IF NOT EXISTS grid_columns INTEGER DEFAULT 2 CHECK (grid_columns BETWEEN 2 AND 4); 