import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Search, Calendar, User, ArrowRight, BookOpen, Clock } from "lucide-react";

type Blog = {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  author: string;
  content: string;
  category: string;
  tags: string[];
  is_featured: boolean;
  published_at: string | null;
};

// Fallback dummy blogs for LocalStorage when Supabase table isn't created yet
const LOCAL_STORAGE_KEY = "tia_fallback_blogs";
const getLocalBlogs = (): Blog[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Filter for published ones only
      return parsed.filter((b: Blog & { status?: string }) => b.status === "published");
    }
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
      content: "Image compression is key to modern web design...",
      category: "Design",
      tags: ["WebP", "SEO", "Optimization", "Design Systems"],
      is_featured: true,
      published_at: new Date().toISOString(),
    }
  ];
};

const Blog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", "Design", "Marketing", "Development", "Consulting", "General"];

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("id, title, slug, cover_image, author, content, category, tags, is_featured, published_at")
          .eq("status", "published")
          .order("published_at", { ascending: false });

        if (error) {
          if (error.code === "42P01") {
            setBlogs(getLocalBlogs());
            setLoading(false);
            return;
          }
          throw error;
        }
        setBlogs(data || []);
      } catch (err) {
        console.error("Error loading blogs from DB:", err);
        setBlogs(getLocalBlogs());
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
                          b.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || b.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const featuredBlog = filteredBlogs.find((b) => b.is_featured) || filteredBlogs[0];
  const listBlogs = featuredBlog ? filteredBlogs.filter((b) => b.id !== featuredBlog.id) : filteredBlogs;

  // Simple reading time estimator
  const getReadingTime = (text: string) => {
    const wpm = 200;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    return `${time} min read`;
  };

  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "The TIA Journal",
    "description": "Stay ahead with regular guides, design inspiration, branding tips, and strategic tech insights from our digital studio.",
    "url": "https://www.tiasoftwaresolutions.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "TIA Software Solutions",
      "logo": "https://www.tiasoftwaresolutions.com/favicon.webp"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>The TIA Journal — Tech & Creative Insights</title>
        <meta name="description" content="Stay ahead with regular guides, design inspiration, branding tips, and strategic tech insights from our digital studio." />
        <link rel="canonical" href="https://www.tiasoftwaresolutions.com/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="The TIA Journal — Tech & Creative Insights" />
        <meta property="og:description" content="Stay ahead with regular guides, design inspiration, branding tips, and strategic tech insights from our digital studio." />
        <meta property="og:url" content="https://www.tiasoftwaresolutions.com/blog" />
        <meta property="og:image" content="https://www.tiasoftwaresolutions.com/assets/logo.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(blogListSchema)}
        </script>
      </Helmet>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[140px] -translate-y-1/2 pointer-events-none" />
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold text-primary tracking-widest uppercase mb-4 block">
              Resources & Insights
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              The TIA <span className="gradient-text">Journal</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay ahead with regular guides, design inspiration, branding tips, and strategic tech insights from our digital studio.
            </p>
            <div className="section-divider mt-6" />
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding pt-0">
        <div className="container">
          
          {/* Controls: Category Selector & Search */}
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-16 pb-8 border-b border-border/50">
            <div className="flex gap-2 flex-wrap justify-center md:justify-start">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                      : "bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-full pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading articles...</div>
          ) : (
            <>
              {/* Featured Blog Highlight */}
              {featuredBlog && activeCategory === "all" && !search && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="mb-16"
                >
                  <Link to={`/blog/${featuredBlog.slug}`} className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-card/20 rounded-2xl overflow-hidden border border-border/50 p-6 md:p-8 hover:border-primary/20 transition-all duration-300">
                    <div className="lg:col-span-7 h-[250px] md:h-[400px] w-full rounded-xl overflow-hidden relative">
                      {featuredBlog.cover_image ? (
                        <img
                          src={featuredBlog.cover_image}
                          alt={featuredBlog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                          <BookOpen size={48} />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        Featured Post
                      </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
                      <span className="text-xs uppercase font-bold tracking-widest text-primary">
                        {featuredBlog.category}
                      </span>
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight text-foreground group-hover:text-primary transition-colors">
                        {featuredBlog.title}
                      </h2>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {featuredBlog.content.replace(/[#*`_]/g, "").substring(0, 180)}...
                      </p>
                      
                      <div className="flex items-center gap-6 text-xs text-muted-foreground pt-4 border-t border-border/30">
                        <span className="flex items-center gap-1.5"><User size={14} /> {featuredBlog.author}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {featuredBlog.published_at ? new Date(featuredBlog.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {getReadingTime(featuredBlog.content)}</span>
                      </div>

                      <div className="pt-4">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                          Read Full Article <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Grid of Other Blogs */}
              {filteredBlogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(activeCategory !== "all" || search ? filteredBlogs : listBlogs).map((blog, i) => (
                    <motion.article
                      key={blog.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      className="group bg-card/10 border border-border/50 rounded-2xl overflow-hidden hover:border-primary/20 transition-all duration-300 flex flex-col h-full"
                    >
                      <Link to={`/blog/${blog.slug}`} className="flex flex-col h-full">
                        <div className="h-48 w-full overflow-hidden relative">
                          {blog.cover_image ? (
                            <img
                              src={blog.cover_image}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                              <BookOpen size={36} />
                            </div>
                          )}
                          <span className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm text-[10px] font-bold text-primary uppercase tracking-wider px-3 py-1 rounded-full">
                            {blog.category}
                          </span>
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div className="space-y-3">
                            <h3 className="font-extrabold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                              {blog.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                              {blog.content.replace(/[#*`_]/g, "").substring(0, 120)}...
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><User size={12} /> {blog.author}</span>
                            <span className="flex items-center gap-1"><Calendar size={12} /> {blog.published_at ? new Date(blog.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-card/10 border border-border/50 rounded-2xl">
                  <p className="text-muted-foreground">No blog posts found matching your criteria.</p>
                </div>
              )}
            </>
          )}

        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Blog;
