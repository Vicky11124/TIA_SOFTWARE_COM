#!/usr/bin/env node
/**
 * TIA Software Solutions — Build-time Prerender Script
 *
 * Uses puppeteer-core with the system-installed Edge/Chrome to visit
 * every route after `vite build`, wait for React + data fetches, and
 * write the fully-rendered HTML back to dist/.
 *
 * Result: crawlers that don't run JS (Facebook, WhatsApp, LinkedIn,
 * Twitter, many SEO bots) receive correct title, OG tags, Twitter
 * cards, JSON-LD, and visible content on first request.
 *
 * Usage:
 *   npm run prerender        # prerender only (dist must exist)
 *   npm run build:prod       # vite build + prerender
 */

import puppeteer from "puppeteer-core";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, "..", "dist");
const PORT = 4173;

// ── Detect system browser ────────────────────────────────────────
function findBrowser() {
  const candidates = [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// ── Supabase public credentials (anon key — safe to embed) ───────
const SUPABASE_URL = "https://dabsuflxmuafjfemxrtc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhYnN1Zmx4bXVhZmpmZW14cnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NDExMTIsImV4cCI6MjA5MDUxNzExMn0.ayVDcsb_KOntc-BpCTcjwwF46p5Al0a4cuUZFzBQeOo";

// ── Static routes ────────────────────────────────────────────────
const STATIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/services/branding-essentials",
  "/services/digital-marketing",
  "/services/creative-design",
  "/services/ui-ux-design",
  "/services/video-motion-graphics",
  "/services/stories-reels-assets",
  "/services/seasonal-festive",
  "/services/event-launch-graphics",
  "/services/virtual-assistance",
  "/plans",
  "/contact",
  "/blog",
  "/faq",
];

// ── Fetch published blog slugs from Supabase ─────────────────────
async function fetchBlogSlugs() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blogs?select=slug&status=eq.published`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blogs = await res.json();
    console.log(`  Found ${blogs.length} published blog(s) in Supabase`);
    return blogs.map((b) => `/blog/${b.slug}`);
  } catch (err) {
    console.warn(`  ⚠ Could not fetch blogs: ${err.message}`);
    console.warn(`  → Using fallback demo blog slug`);
    return ["/blog/webp-future-image-optimization"];
  }
}

// ── Static file server with SPA fallback ─────────────────────────
function startServer(fallbackHtml) {
  const MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".xml": "application/xml",
    ".txt": "text/plain",
  };

  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:${PORT}`);
      let fp = path.join(DIST_DIR, url.pathname);

      if (fs.existsSync(fp) && fs.statSync(fp).isDirectory())
        fp = path.join(fp, "index.html");

      if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
        const ext = path.extname(fp).toLowerCase();
        res.writeHead(200, {
          "Content-Type": MIME[ext] || "application/octet-stream",
        });
        fs.createReadStream(fp).pipe(res);
      } else {
        // SPA fallback — serve the saved SPA shell (not the file on disk
        // which may have been overwritten by a previous prerendered route)
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(fallbackHtml);
      }
    });
    server.listen(PORT, () => resolve(server));
  });
}

// ── Helper: wait for a fixed duration ────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Main ─────────────────────────────────────────────────────────
async function prerender() {
  console.log("\n🚀 TIA Prerender — Generating static HTML\n");

  // 1. Verify dist
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist/ not found. Run "npm run build" first.');
    process.exit(1);
  }

  // 2. Find browser
  const execPath = findBrowser();
  if (!execPath) {
    console.error("❌ No Chrome or Edge found on this system.");
    process.exit(1);
  }
  console.log(`🌐 Using browser: ${execPath}\n`);

  // 3. Collect routes
  console.log("📋 Collecting routes...");
  const blogRoutes = await fetchBlogSlugs();
  const allRoutes = [...STATIC_ROUTES, ...blogRoutes];
  console.log(`  Total: ${allRoutes.length} routes\n`);

  // 4. Save the original SPA shell before any overwrites
  const spaShell = fs.readFileSync(
    path.join(DIST_DIR, "index.html"),
    "utf-8"
  );

  // 5. Start server (uses in-memory spaShell for SPA fallback)
  const server = await startServer(spaShell);
  console.log(`📡 Static server on http://localhost:${PORT}\n`);

  // 6. Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: execPath,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  // Block unnecessary resources to speed up rendering
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const type = req.resourceType();
    if (["image", "font", "media"].includes(type)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  let ok = 0;
  let fail = 0;

  // 7. Render each route
  for (const route of allRoutes) {
    try {
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: "networkidle0",
        timeout: 20000,
      });
      // Wait for React to render content inside #root
      await page.waitForSelector("#root > *", { timeout: 10000 });
      // Extra settle time for Helmet to update <head> + async renders
      await sleep(1000);

      const html = await page.content();

      // Determine output path
      const outFile =
        route === "/"
          ? path.join(DIST_DIR, "index.html")
          : path.join(
              DIST_DIR,
              ...route.split("/").filter(Boolean),
              "index.html"
            );

      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      fs.writeFileSync(outFile, html, "utf-8");
      ok++;
      console.log(`  ✅ ${route}`);
    } catch (err) {
      fail++;
      console.error(`  ❌ ${route} — ${err.message}`);
    }
  }

  // 8. Write 404.html (SPA shell for hosting platforms like Netlify/Vercel)
  fs.writeFileSync(path.join(DIST_DIR, "404.html"), spaShell, "utf-8");
  console.log(`\n  📄 404.html created (SPA fallback for hosting)`);

  // 9. Cleanup
  await browser.close();
  server.close();

  console.log(`\n✨ Done — ${ok} prerendered, ${fail} failed\n`);
  if (fail > 0) process.exit(1);
}

prerender().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
