-- Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  cover_image TEXT,
  author TEXT NOT NULL DEFAULT 'Admin',
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Uncategorized',
  tags TEXT[] NOT NULL DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  canonical_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- RLS policies for blogs
CREATE POLICY "Anyone can view published blogs" ON public.blogs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage blogs" ON public.blogs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at column
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create blogs storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blogs', 'blogs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for blogs bucket
CREATE POLICY "Blog images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'blogs');

CREATE POLICY "Admins can upload blog images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blogs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blog images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'blogs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blog images" ON storage.objects
  FOR DELETE USING (bucket_id = 'blogs' AND public.has_role(auth.uid(), 'admin'));
