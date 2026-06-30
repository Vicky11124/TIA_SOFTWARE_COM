import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, User, ArrowLeft, BookOpen, Clock, Tag } from "lucide-react";

type Blog = {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  author: string;
  content: string;
  category: string;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  canonical_url: string | null;
  published_at: string | null;
};

// Fallback dummy blogs for LocalStorage when Supabase table isn't created yet
const LOCAL_STORAGE_KEY = "tia_fallback_blogs";
const getLocalBlogs = (): Blog[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Local storage error:", e);
  }
  return [
    {
      id: "demo-1",
      title: "Why WebP is the Future of Web Image Optimization",
      slug: "webp-future-image-optimization",
      cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      author: "TIA Tech Team",
      content: `# Why WebP is the Future of Web Image Optimization

Image compression is key to modern web design. In this post, we discuss how WebP provides high-quality graphics at a fraction of PNG/JPG file sizes.

## Key Benefits of WebP:
- **Up to 30% smaller file sizes** compared to JPEG.
- **Transparency support** similar to PNG.
- **Animation support** replacing heavy GIFs.

Implementing WebP on your business website can boost SEO and search ranking dramatically by increasing load speed!`,
      category: "Design",
      tags: ["WebP", "SEO", "Optimization", "Design Systems"],
      meta_title: "WebP Image Optimization Guide | TIA Blog",
      meta_description: "Learn why WebP is crucial for modern web optimization, performance, and search ranking.",
      meta_keywords: "webp, image optimization, speed up website, seo",
      canonical_url: "",
      published_at: new Date().toISOString(),
    }
  ];
};

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .single();

        if (error) {
          if (error.code === "42P01") {
            const local = getLocalBlogs();
            const found = local.find((b) => b.slug === slug);
            setBlog(found || null);
            setLoading(false);
            return;
          }
          throw error;
        }
        setBlog(data);
      } catch (err) {
        console.error("Error reading blog by slug:", err);
        const local = getLocalBlogs();
        const found = local.find((b) => b.slug === slug);
        setBlog(found || null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  // Compute SEO values for Helmet (declarative <head> management)
  const blogTitle = blog?.meta_title || (blog ? `${blog.title} | TIA Software Solutions` : "TIA Software Solutions — Blog");
  const blogDesc = blog?.meta_description || (blog ? blog.content.substring(0, 160).replace(/[#*`_\n]/g, " ").trim() : "");
  const blogImage = blog?.cover_image || "";
  const blogUrl = blog?.canonical_url || (blog ? `https://www.tiasoftwaresolutions.com/blog/${blog.slug}` : "");

  const jsonLdSchema = blog ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blogDesc,
    "image": blog.cover_image ? [blog.cover_image] : [],
    "datePublished": blog.published_at || new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": blog.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "TIA Software Solutions",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.tiasoftwaresolutions.com/favicon.webp"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": blogUrl
    }
  }) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-40 text-muted-foreground">Loading article details...</div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-40 space-y-4">
          <h2 className="text-2xl font-bold">Article not found</h2>
          <p className="text-muted-foreground">The blog post you are looking for does not exist or has been unpublished.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft size={16} /> Back to TIA Journal
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const getReadingTime = (text: string) => {
    const wpm = 200;
    const words = text.trim().split(/\s+/).length;
    return `${Math.ceil(words / wpm)} min read`;
  };

  return (
    <div className="min-h-screen bg-background">
      {blog && (
        <Helmet>
          <title>{blogTitle}</title>
          {blogDesc && <meta name="description" content={blogDesc} />}
          {blog.meta_keywords && <meta name="keywords" content={blog.meta_keywords} />}
          {blogUrl && <link rel="canonical" href={blogUrl} />}

          {/* Open Graph */}
          <meta property="og:type" content="article" />
          <meta property="og:title" content={blogTitle} />
          {blogDesc && <meta property="og:description" content={blogDesc} />}
          {blogImage && <meta property="og:image" content={blogImage} />}
          {blogUrl && <meta property="og:url" content={blogUrl} />}

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={blogTitle} />
          {blogDesc && <meta name="twitter:description" content={blogDesc} />}
          {blogImage && <meta name="twitter:image" content={blogImage} />}

          {/* JSON-LD Structured Data */}
          {jsonLdSchema && (
            <script type="application/ld+json">{jsonLdSchema}</script>
          )}
        </Helmet>
      )}
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 pb-12 overflow-hidden border-b border-border/30">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[140px] -translate-y-1/2 pointer-events-none" />
        <div className="container relative z-10 max-w-4xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to TIA Journal
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 w-fit block">
              {blog.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-foreground">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-4">
              <span className="flex items-center gap-1.5"><User size={16} className="text-primary" /> {blog.author}</span>
              <span className="flex items-center gap-1.5"><Calendar size={16} /> {blog.published_at ? new Date(blog.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}</span>
              <span className="flex items-center gap-1.5"><Clock size={16} /> {getReadingTime(blog.content)}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Body */}
      <section className="section-padding">
        <div className="container max-w-4xl">
          <div className="space-y-10">
            {/* Cover image */}
            {blog.cover_image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/50"
              >
                <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover" />
              </motion.div>
            )}

            {/* Content Body - Styled with prose-invert for dark premium looks */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="prose prose-invert max-w-none prose-headings:font-extrabold prose-p:leading-relaxed prose-a:text-primary hover:prose-a:underline"
            >
              {/* Parse Markdown headings and paragraphs basics */}
              <div className="whitespace-pre-line text-muted-foreground md:text-lg leading-relaxed">
                {blog.content}
              </div>
            </motion.div>

            {/* Tags footer */}
            {blog.tags.length > 0 && (
              <div className="pt-8 border-t border-border/30 flex flex-wrap items-center gap-2">
                <Tag size={16} className="text-primary mr-1" />
                {blog.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-muted/60 border border-border/50 text-muted-foreground px-3 py-1 rounded-full font-semibold">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Blog;
export { BlogDetail };
