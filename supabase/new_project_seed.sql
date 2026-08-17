-- ==========================================
-- COMPLETE SCHEMAS, TABLES & RLS POLICIES
-- ==========================================

-- 1. Create admin role enum & user_roles table
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 2. Trigger Helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 3. Banners Table
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  highlight TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  cta_text TEXT NOT NULL DEFAULT 'Book Now',
  cta_link TEXT NOT NULL DEFAULT 'https://wa.me/447451255217',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active banners" ON public.banners;
CREATE POLICY "Anyone can view active banners" ON public.banners FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage banners" ON public.banners;
CREATE POLICY "Admins can manage banners" ON public.banners FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 4. Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can view leads" ON public.leads;
CREATE POLICY "Admins can view leads" ON public.leads FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
CREATE POLICY "Admins can update leads" ON public.leads FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;
CREATE POLICY "Admins can delete leads" ON public.leads FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- 5. Plans Table
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  price_usd TEXT NOT NULL DEFAULT '',
  features TEXT[] NOT NULL DEFAULT '{}',
  is_popular BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active plans" ON public.plans;
CREATE POLICY "Anyone can view active plans" ON public.plans FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage plans" ON public.plans;
CREATE POLICY "Admins can manage plans" ON public.plans FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 6. SEO Settings Table
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view SEO settings" ON public.seo_settings;
CREATE POLICY "Anyone can view SEO settings" ON public.seo_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage SEO settings" ON public.seo_settings;
CREATE POLICY "Admins can manage SEO settings" ON public.seo_settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 7. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view settings" ON public.site_settings;
CREATE POLICY "Anyone can view settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage settings" ON public.site_settings;
CREATE POLICY "Admins can manage settings" ON public.site_settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 8. Blogs Table
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
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published blogs" ON public.blogs;
CREATE POLICY "Anyone can view published blogs" ON public.blogs FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admins can manage blogs" ON public.blogs;
CREATE POLICY "Admins can manage blogs" ON public.blogs FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 9. Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blogs', 'blogs', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Banner images are publicly accessible" ON storage.objects;
CREATE POLICY "Banner images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
DROP POLICY IF EXISTS "Admins can upload banner images" ON storage.objects;
CREATE POLICY "Admins can upload banner images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Blog images are publicly accessible" ON storage.objects;
CREATE POLICY "Blog images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'blogs');
DROP POLICY IF EXISTS "Admins can upload blog images" ON storage.objects;
CREATE POLICY "Admins can upload blog images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blogs' AND public.has_role(auth.uid(), 'admin'));

-- ==========================================
-- SEED DATA TRANSFERRED FROM OLD DATABASE
-- ==========================================

-- Seed Plans
INSERT INTO public.plans (id, name, price, price_usd, features, is_popular, is_active, sort_order, created_at, updated_at)
VALUES 
  (
    'ee489ee8-a372-4685-b35a-52a91a5a5a60',
    'Basic',
    '149.99',
    '199.99',
    ARRAY['Logo Design (2-3 concepts)', 'Business Card Design', 'Basic Brand Identity', '2 Rounds of Revisions', 'Social Media Graphics', 'Standard Turnaround Time', 'Basic Website (Hosting, Domain & 2 Emails)'],
    false,
    true,
    0,
    '2026-03-31T08:41:19.93321+00:00',
    '2026-04-09T06:11:38.729261+00:00'
  ),
  (
    'e7f22031-dd9c-43c1-91ca-582cb2cebf8d',
    'Standard',
    '299.99',
    '399.99',
    ARRAY['Everything in the Basic Plan', 'Social Media Templates & Banners', 'Presentation/Deck Design', '2 Rounds of Revisions', 'Standard Turnaround Time'],
    false,
    true,
    1,
    '2026-03-31T08:41:19.93321+00:00',
    '2026-04-09T06:11:38.729261+00:00'
  ),
  (
    '40e2bf8d-17ca-4901-82a0-c46534782661',
    'Pro',
    '499.99',
    '649.99',
    ARRAY['Everything in the Standard Plan', 'Packaging & Merchandise Design', 'Motion Graphics / Animated Content', 'Unlimited Revisions', 'Social Media Promotions', 'Express Turnaround Time'],
    true,
    true,
    2,
    '2026-03-31T08:41:19.93321+00:00',
    '2026-04-09T06:11:38.729261+00:00'
  ),
  (
    'c417fbc9-8a5a-4545-9086-54679743dc1e',
    'Premium',
    '699.99',
    '899.99',
    ARRAY['Everything in the Pro Plan', 'UX/UI Design for Apps & Websites', 'Virtual Assistance', 'Dedicated Account Manager', 'ERP Tool (Any one module)'],
    false,
    true,
    3,
    '2026-03-31T08:41:19.93321+00:00',
    '2026-04-09T06:11:38.729261+00:00'
  )
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, price_usd = EXCLUDED.price_usd, features = EXCLUDED.features, is_popular = EXCLUDED.is_popular, is_active = EXCLUDED.is_active, sort_order = EXCLUDED.sort_order;

-- Seed SEO Settings
INSERT INTO public.seo_settings (id, page_slug, meta_title, meta_description, meta_keywords, og_title, og_description, og_image, created_at, updated_at)
VALUES 
  (
    'c21b8157-f96a-4027-9a88-1a40beb9ed97',
    'home',
    'TIA Software Solutions | Virtual Assistance, Web, Software & Digital Marketing Experts',
    'TIA Software Solutions offers web development, software solutions, designing, digital marketing & virtual assistance to help your business grow faster.',
    'software development company, web development services, digital marketing agency, virtual assistance services, SEO services, mobile app development, IT solutions company, software company, TIA Software Solutions',
    'TIA Software Solutions | Digital Growth Partner',
    'Boost your business with expert web development, digital marketing, and virtual assistance services by TIA Software Solutions.',
    'https://www.tiasoftwaresolutions.com/images/og-banner.jpg',
    '2026-04-15T05:06:34.952247+00:00',
    '2026-04-15T05:06:34.952247+00:00'
  ),
  (
    '911239e4-5cec-4bce-b1be-37ea6825809d',
    'about',
    'About TIA Software Solutions | Your Trusted Digital Growth Partner',
    'Learn about TIA Software Solutions – a trusted provider of software development, web design, digital marketing, and virtual assistance services.',
    'about TIA Software Solutions, software company, web development company, digital marketing agency, virtual assistance services, IT solutions company, TIA company profile',
    'About TIA Software Solutions | Digital Experts',
    'Discover TIA Software Solutions, delivering innovative software, web development, digital marketing, and virtual assistance services.',
    'https://tiasoftwaresolutions.com/images/about-banner.jpg',
    '2026-04-15T05:14:45.86847+00:00',
    '2026-04-15T05:14:45.86847+00:00'
  ),
  (
    'cf0874c8-e66e-4fee-b5d1-e5d9de04467d',
    'services',
    'Our Services | Web, Virtual Assistance, Software & Digital Marketing Solutions',
    'Explore TIA Software Solutions services including web development, software solutions, digital marketing, and virtual assistance to grow your business.',
    'software development services, web development company, digital marketing services, virtual assistance services, SEO services, mobile app development, IT services company, TIA Software Solutions services',
    'TIA Software Solutions Services | Digital Solutions',
    'Discover our complete range of services including web development, software solutions, digital marketing, and virtual assistance.',
    'https://tiasoftwaresolutions.com/images/services-banner.jpg',
    '2026-04-15T05:17:29.317493+00:00',
    '2026-04-15T05:17:29.317493+00:00'
  ),
  (
    'a68f372a-e026-4d51-8925-3dab07008b52',
    'plans',
    'Pricing Plans | Affordable Web & Digital Solutions',
    'Explore affordable pricing plans for web development, digital marketing, and virtual assistance services by TIA Software Solutions.',
    'pricing plans IT services, web development pricing, digital marketing packages, virtual assistant pricing, affordable IT services, TIA Software Solutions plans',
    'TIA Software Solutions Pricing Plans | Affordable Packages',
    'Choose from flexible and affordable pricing plans for web development, digital marketing, and virtual assistance services.',
    'https://tiasoftwaresolutions.com/images/pricing-banner.jpg',
    '2026-04-15T05:24:21.522071+00:00',
    '2026-04-15T05:24:21.522071+00:00'
  ),
  (
    '3288a670-9c5d-4410-9e02-c2373304beb7',
    'contact',
    'Contact TIA Software Solutions | Get a Free Consultation',
    'Contact TIA Software Solutions for web development, digital marketing, and virtual assistance services. Get a free consultation today.',
    'contact TIA Software Solutions, IT company contact, web development contact, digital marketing agency contact, virtual assistant services contact, get IT services quote',
    'Contact TIA Software Solutions | Lets Grow Your Business',
    'Get in touch with TIA Software Solutions for expert web, software, digital marketing, and virtual assistance services.',
    'https://tiasoftwaresolutions.com/images/contact-banner.jpg',
    '2026-04-15T05:26:09.365869+00:00',
    '2026-07-15T11:52:10.078182+00:00'
  )
ON CONFLICT (page_slug) DO UPDATE 
SET meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description, meta_keywords = EXCLUDED.meta_keywords, og_title = EXCLUDED.og_title, og_description = EXCLUDED.og_description, og_image = EXCLUDED.og_image;

-- Seed Site Settings
INSERT INTO public.site_settings (id, key, value, updated_at)
VALUES 
  ('b5fb7b76-e46a-44bd-993c-80ad709425f7', 'whatsapp_number', '+44 7451 255217', '2026-05-05T06:44:09.075915+00:00'),
  ('27c70bfc-e01e-495b-b88e-643aef09f811', 'phone', '+44 7451 255217', '2026-05-05T06:44:09.753154+00:00'),
  ('63d397ed-caa6-4e93-a13b-51f6b677f43f', 'address', '', '2026-05-05T06:44:10.114662+00:00'),
  ('8091402e-fe60-420b-b6c5-5df8d032b89a', 'instagram_url', '', '2026-05-05T06:44:10.458301+00:00'),
  ('49f7e004-66e3-4324-ac83-fa51bf6170b4', 'facebook_url', '', '2026-05-05T06:44:10.79907+00:00'),
  ('b125a27d-06c8-4670-a0c1-597dd53c802d', 'email', 'sales@tiasoftwaresolutions.com', '2026-05-05T08:48:46.46025+00:00')
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value;
