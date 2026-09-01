import fs from "fs";
import path from "path";

const DOMAIN = "https://www.tiasoftwaresolutions.com";
const TODAY = new Date().toISOString().split("T")[0];

const CORE_PAGES = [
  { path: "", priority: "1.0", changefreq: "daily" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/services", priority: "0.9", changefreq: "weekly" },
  { path: "/plans", priority: "0.8", changefreq: "monthly" },
  { path: "/blog", priority: "0.8", changefreq: "daily" },
  { path: "/faq", priority: "0.6", changefreq: "monthly" },
  { path: "/contact", priority: "0.8", changefreq: "monthly" }
];

const SERVICE_PAGES = [
  "branding-essentials",
  "digital-marketing",
  "creative-design",
  "ui-ux-design",
  "video-motion-graphics",
  "stories-reels-assets",
  "seasonal-festive",
  "event-launch-graphics",
  "virtual-assistance",
  "website-development",
  "app-development",
  "software-development"
];

// Helper to load .env into process.env if not already set
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          val = val.replace(/^["']|["']$/g, "");
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

async function fetchDynamicBlogSlugs() {
  loadEnv();
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://tuixjvdojimkhtfilxce.supabase.co";
  const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_Vd_j-5Sv89WukkAzSZkRUw_uu99NXhz";
  
  if (!SUPABASE_KEY) {
    console.log("No Supabase key found in env, using default static blog slugs.");
    return ["webp-future-image-optimization"];
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blogs?select=slug&status=eq.published`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    return data.map(b => b.slug ? b.slug.replace(/^\/?(blog\/)?/, "") : "").filter(Boolean);
  } catch (err) {
    console.warn("Could not fetch dynamic blog slugs from Supabase, using fallback:", err.message);
    return ["webp-future-image-optimization"];
  }
}

async function generateSitemap() {
  console.log(` Generating sitemap.xml for ${DOMAIN} (Date: ${TODAY})...`);
  const blogSlugs = await fetchDynamicBlogSlugs();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Pages -->\n`;

  CORE_PAGES.forEach(page => {
    const loc = page.path === "" ? `${DOMAIN}/` : `${DOMAIN}${page.path}`;
    xml += `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
  });

  xml += `\n  <!-- Service Detail Pages -->\n`;
  SERVICE_PAGES.forEach(slug => {
    xml += `  <url>
    <loc>${DOMAIN}/services/${slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
  });

  xml += `\n  <!-- Blog Posts -->\n`;
  blogSlugs.forEach(slug => {
    xml += `  <url>
    <loc>${DOMAIN}/blog/${slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
  });

  xml += `</urlset>\n`;

  const sitemapPath = path.resolve(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(sitemapPath, xml, "utf-8");
  console.log(`✅ Sitemap successfully generated at: ${sitemapPath}`);
}

generateSitemap();
