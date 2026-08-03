import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, ArrowLeft, Eye, EyeOff, Sparkles, Image as ImageIcon, Globe } from "lucide-react";

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
  is_featured: boolean;
  status: string;
  published_at: string | null;
  created_at?: string;
  updated_at?: string;
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
      is_featured: true,
      status: "published",
      published_at: new Date().toISOString(),
    }
  ];
};

const saveLocalBlogs = (blogs: Blog[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(blogs));
};

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLocalStorageFallback, setIsLocalStorageFallback] = useState(false);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        // If table doesn't exist, fallback to localStorage silently
        if (error.code === "42P01") {
          console.warn("Supabase 'blogs' table does not exist yet. Falling back to local storage.");
          setIsLocalStorageFallback(true);
          setBlogs(getLocalBlogs());
          return;
        }
        throw error;
      }
      setBlogs(data || []);
      setIsLocalStorageFallback(false);
    } catch (err: unknown) {
      console.error("Error fetching blogs:", err);
      // Fallback
      setIsLocalStorageFallback(true);
      setBlogs(getLocalBlogs());
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const emptyBlog: Omit<Blog, "id"> = {
    title: "",
    slug: "",
    cover_image: "",
    author: "Admin",
    content: "",
    category: "General",
    tags: [],
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    canonical_url: "",
    is_featured: false,
    status: "draft",
    published_at: new Date().toISOString().substring(0, 16),
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;

    if (isLocalStorageFallback) {
      // Fake upload to unsplash/data-url for local storage fallback
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploading(false);
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }

    try {
      const { error } = await supabase.storage.from("blogs").upload(path, file);
      if (error) {
        // bucket might not exist, let's try 'banners' bucket as a fallback
        const { error: err2 } = await supabase.storage.from("banners").upload(path, file);
        if (err2) {
          toast.error("Upload failed on both 'blogs' & 'banners' buckets: " + error.message);
          setUploading(false);
          return null;
        }
        const { data } = supabase.storage.from("banners").getPublicUrl(path);
        setUploading(false);
        return data.publicUrl;
      }
      const { data } = supabase.storage.from("blogs").getPublicUrl(path);
      setUploading(false);
      return data.publicUrl;
    } catch (e: unknown) {
      toast.error("Upload failed: " + (e instanceof Error ? e.message : String(e)));
      setUploading(false);
      return null;
    }
  };

  const handleSave = async (blog: Omit<Blog, "id"> & { id?: string }) => {
    if (!blog.title || !blog.slug) {
      toast.error("Title and Slug are required.");
      return;
    }

    if (isLocalStorageFallback) {
      const local = getLocalBlogs();
      if (blog.id) {
        const updated = local.map((b) => (b.id === blog.id ? { ...b, ...blog } as Blog : b));
        saveLocalBlogs(updated);
        toast.success("Blog updated (Saved to Local Storage fallback)");
      } else {
        const newBlog: Blog = {
          ...blog,
          id: `blog-${Date.now()}`,
          created_at: new Date().toISOString(),
        } as Blog;
        local.push(newBlog);
        saveLocalBlogs(local);
        toast.success("Blog created (Saved to Local Storage fallback)");
      }
      setShowForm(false);
      setEditing(null);
      fetchBlogs();
      return;
    }

    try {
      if (blog.id) {
        const { error } = await supabase.from("blogs").update(blog).eq("id", blog.id);
        if (error) throw error;
        toast.success("Blog updated successfully");
      } else {
        const { error } = await supabase.from("blogs").insert(blog);
        if (error) throw error;
        toast.success("Blog created successfully");
      }
      setShowForm(false);
      setEditing(null);
      fetchBlogs();
    } catch (e: unknown) {
      toast.error("Database save failed: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    if (isLocalStorageFallback) {
      const local = getLocalBlogs();
      const updated = local.filter((b) => b.id !== id);
      saveLocalBlogs(updated);
      toast.success("Blog deleted from Local Storage fallback");
      fetchBlogs();
      return;
    }

    try {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) throw error;
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (e: unknown) {
      toast.error("Delete failed: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                          b.content.toLowerCase().includes(search.toLowerCase()) ||
                          b.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {isLocalStorageFallback && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          <span>
            ⚠️ <strong>Supabase Migration Pending:</strong> The <code>blogs</code> table is missing from your database. Running in <strong>Local Storage fallback mode</strong>. Copy the SQL script in <code>supabase/migrations/</code> to your Supabase SQL editor to link the database.
          </span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Manager</h1>
          <p className="text-sm text-muted-foreground">Create, draft, publish, and optimize blogs for SEO.</p>
        </div>
        {!showForm && (
          <Button variant="hero" onClick={() => { setEditing(null); setShowForm(true); }}>
            <Plus size={18} className="mr-2" /> Write New Blog
          </Button>
        )}
      </div>

      {showForm ? (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Sparkles size={18} className="text-primary animate-pulse" />
              {editing ? "Edit Blog Post" : "Compose New Blog"}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditing(null); }}>
              <ArrowLeft size={16} className="mr-2" /> Back to List
            </Button>
          </div>

          <BlogForm
            initial={editing || emptyBlog}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditing(null); }}
            onUpload={handleImageUpload}
            uploading={uploading}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/30 p-4 rounded-xl border border-border">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Search blogs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              {["all", "published", "draft"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                    statusFilter === status
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Table Grid */}
          <div className="grid gap-4">
            {filteredBlogs.map((b) => (
              <div key={b.id} className="glass-card p-4 flex flex-col md:flex-row items-start md:items-center gap-4 hover-lift">
                {b.cover_image ? (
                  <img src={b.cover_image} alt="" className="w-full md:w-32 h-20 object-cover rounded-lg shrink-0 bg-muted border border-border" />
                ) : (
                  <div className="w-full md:w-32 h-20 rounded-lg shrink-0 bg-muted border border-border flex items-center justify-center text-muted-foreground">
                    <ImageIcon size={24} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {b.category}
                    </span>
                    {b.is_featured && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500">
                        ★ Featured
                      </span>
                    )}
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      b.status === "published" ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-500/10 text-zinc-500"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg leading-snug truncate hover:text-primary transition-colors">
                    {b.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span>By {b.author}</span>
                    <span>•</span>
                    <span>{b.published_at ? new Date(b.published_at).toLocaleDateString() : "No Date"}</span>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto md:shrink-0 justify-end pt-4 md:pt-0 border-t md:border-t-0 border-border/50">
                  <button
                    onClick={() => { setEditing(b); setShowForm(true); }}
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                    title="Edit blog"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 transition-all"
                    title="Delete blog"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {filteredBlogs.length === 0 && (
              <div className="text-center py-16 glass-card">
                <ImageIcon size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-bold mb-1">No blogs found</h3>
                <p className="text-sm text-muted-foreground">Click "Write New Blog" to get started.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const BlogForm = ({
  initial,
  onSave,
  onCancel,
  onUpload,
  uploading,
}: {
  initial: Omit<Blog, "id"> & { id?: string };
  onSave: (b: Omit<Blog, "id"> & { id?: string }) => void;
  onCancel: () => void;
  onUpload: (f: File) => Promise<string | null>;
  uploading: boolean;
}) => {
  const [form, setForm] = useState(initial);
  const [previewTab, setPreviewTab] = useState(false);

  // Auto-generate slug from title
  const generateSlug = () => {
    if (!form.title) return;
    const slugified = form.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setForm({ ...form, slug: slugified });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await onUpload(file);
    if (url) {
      setForm({ ...form, cover_image: url });
      toast.success("Cover image uploaded");
    }
  };

  // Helper to insert markdown format at textarea selection
  const insertFormat = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("blog-content-editor") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = prefix + (selected || "text") + suffix;
    const updatedContent = text.substring(0, start) + replacement + text.substring(end);
    setForm({ ...form, content: updatedContent });

    // refocus and reset cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected || "text").length);
    }, 50);
  };

  return (
    <div className="space-y-6">
      {/* 2-Column fields layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Main Details & Editor */}
        <div className="lg:col-span-2 space-y-4">
          <Input 
            label="Blog Title" 
            value={form.title} 
            onChange={(v) => setForm({ ...form, title: v })} 
            placeholder="e.g. 10 Ways to Scale Your Remote Design Workflow"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Slug (URL path)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. 10-ways-scale-remote-design"
                  className="flex-1 bg-muted/50 border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="px-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Generate slug from title"
                >
                  <Sparkles size={14} /> Auto
                </button>
              </div>
            </div>

            <Input 
              label="Author Name" 
              value={form.author} 
              onChange={(v) => setForm({ ...form, author: v })} 
            />
          </div>

          {/* Content Rich-Text Markdown Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium block">Blog Content (Markdown supported)</label>
              <div className="flex gap-2 border border-border rounded-lg p-0.5 bg-muted/30">
                <button
                  type="button"
                  onClick={() => setPreviewTab(false)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${!previewTab ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab(true)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${previewTab ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Preview
                </button>
              </div>
            </div>

            {!previewTab ? (
              <div className="border border-border rounded-lg overflow-hidden bg-muted/20">
                {/* Editor formatting toolbar */}
                <div className="bg-card/50 px-3 py-2 border-b border-border flex flex-wrap gap-1.5 items-center">
                  <button type="button" onClick={() => insertFormat("**", "**")} className="px-2 py-1 rounded text-xs font-bold hover:bg-muted text-foreground/80" title="Bold">B</button>
                  <button type="button" onClick={() => insertFormat("*", "*")} className="px-2 py-1 rounded text-xs italic hover:bg-muted text-foreground/80" title="Italic">I</button>
                  <button type="button" onClick={() => insertFormat("## ")} className="px-2 py-1 rounded text-xs font-semibold hover:bg-muted text-foreground/80" title="Header 2">H2</button>
                  <button type="button" onClick={() => insertFormat("### ")} className="px-2 py-1 rounded text-xs font-semibold hover:bg-muted text-foreground/80" title="Header 3">H3</button>
                  <button type="button" onClick={() => insertFormat("\n- ")} className="px-2 py-1 rounded text-xs hover:bg-muted text-foreground/80" title="Bullet List">• List</button>
                  <button type="button" onClick={() => insertFormat("[", "](url)")} className="px-2 py-1 rounded text-xs hover:bg-muted text-foreground/80 text-primary underline" title="Link">Link</button>
                  <button type="button" onClick={() => insertFormat("\n```javascript\n", "\n```")} className="px-2 py-1 rounded text-xs font-mono hover:bg-muted text-foreground/80" title="Code Block">&lt;/&gt;</button>
                </div>
                <textarea
                  id="blog-content-editor"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write your article details here using Markdown. Use H2, H3 headings, bold text, bullet points to keep readers engaged."
                  rows={15}
                  className="w-full bg-transparent border-0 px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-0 resize-y min-h-[300px]"
                />
              </div>
            ) : (
              <div className="border border-border rounded-lg p-6 bg-card min-h-[345px] max-h-[500px] overflow-y-auto prose prose-invert prose-sm max-w-none">
                {form.content ? (
                  <div className="whitespace-pre-line">
                    {/* Basic visual rendering fallback */}
                    {form.content}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-center py-20">Nothing to preview yet. Start typing your content.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar Settings (Cover Image, Meta SEO, Categories) */}
        <div className="space-y-4">
          
          {/* Metadata section */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-bold text-sm border-b border-border/50 pb-2 flex items-center gap-1.5">
              <Globe size={15} className="text-primary" /> Settings & Categorization
            </h3>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="General">General</option>
                <option value="Design">Design & UI/UX</option>
                <option value="Marketing">Branding & Marketing</option>
                <option value="Development">Tech & Software</option>
                <option value="Consulting">Strategy & Business</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Tags (Comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. SEO, Design, Branding"
                value={form.tags.join(", ")}
                onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  className="rounded text-primary focus:ring-primary"
                />
                Featured Blog
              </label>

              <div>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-lg px-2 py-1 text-xs font-bold text-foreground focus:outline-none"
                >
                  <option value="draft">Draft 🗒️</option>
                  <option value="published">Publish 🚀</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Publish Date</label>
              <input
                type="datetime-local"
                value={form.published_at ? form.published_at.substring(0, 16) : ""}
                onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Cover image uploader */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-bold text-sm border-b border-border/50 pb-2">Cover Image</h3>
            
            <div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="w-full text-xs text-muted-foreground file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
              />
              {uploading && <div className="text-xs text-primary mt-1 animate-pulse">Uploading cover image...</div>}
            </div>

            <Input
              label="Or Image URL"
              value={form.cover_image || ""}
              onChange={(v) => setForm({ ...form, cover_image: v })}
              placeholder="https://example.com/image.jpg"
            />

            {form.cover_image && (
              <img src={form.cover_image} alt="Preview" className="h-32 w-full object-cover rounded-lg border border-border" />
            )}
          </div>

          {/* SEO Parameters Panel */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-bold text-sm border-b border-border/50 pb-2">SEO Optimization</h3>

            <Input 
              label="SEO Meta Title" 
              value={form.meta_title || ""} 
              onChange={(v) => setForm({ ...form, meta_title: v })} 
              placeholder="Highly descriptive search page title"
            />

            <div>
              <label className="text-xs font-semibold mb-1 block">Meta Description</label>
              <textarea
                value={form.meta_description || ""}
                onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                placeholder="Google description snippet..."
                rows={3}
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            <Input 
              label="Keywords" 
              value={form.meta_keywords || ""} 
              onChange={(v) => setForm({ ...form, meta_keywords: v })} 
              placeholder="e.g. software solutions, london agency"
            />

            <Input 
              label="Canonical URL" 
              value={form.canonical_url || ""} 
              onChange={(v) => setForm({ ...form, canonical_url: v })} 
              placeholder="e.g. https://www.tiasoftwaresolutions.com/blog/url"
            />
          </div>

        </div>

      </div>

      <div className="flex gap-4 border-t border-border pt-6 justify-end">
        <Button variant="hero-outline" onClick={onCancel}>Cancel</Button>
        <Button variant="hero" onClick={() => onSave(form)}>Save & Apply Changes</Button>
      </div>
    </div>
  );
};

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div>
    <label className="text-sm font-medium mb-1.5 block">{label}</label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
    />
  </div>
);

export default AdminBlogs;
