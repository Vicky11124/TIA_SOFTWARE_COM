import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GeoProvider } from "@/contexts/GeoContext";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Services from "./pages/Services.tsx";
import ServiceDetail from "./pages/ServiceDetail.tsx";
import Plans from "./pages/Plans.tsx";
import Contact from "./pages/Contact.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminBanners from "./pages/admin/AdminBanners.tsx";
import AdminPlans from "./pages/admin/AdminPlans.tsx";
import AdminSEO from "./pages/admin/AdminSEO.tsx";
import AdminLeads from "./pages/admin/AdminLeads.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import AdminBlogs from "./pages/admin/AdminBlogs.tsx";
import Blog from "./pages/Blog.tsx";
import { BlogDetail } from "./pages/BlogDetail.tsx";
import FAQ from "./pages/FAQ.tsx";
import NotFound from "./pages/NotFound.tsx";
import ScrollToTop from "./components/ScrollToTop";
import TiaChatbot from "./components/TiaChatbot/TiaChatbot";

const queryClient = new QueryClient();

const OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3f4bcd31-a5c1-420a-b200-e811caec0b6d/id-preview-3a79d4ef--48407ef1-b28b-4b4e-bac1-aaad364a1361.lovable.app-1774944538908.png";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GeoProvider>
      <TooltipProvider>
        {/* Default SEO — individual pages override via their own <Helmet> */}
        <Helmet>
          <title>Web Design & SEO Agency London | TIA Software Solutions</title>
          <meta name="description" content="Grow your business with custom websites, SEO, software development, and digital marketing. Serving clients throughout the UK. Free consultation available." />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://www.tiasoftwaresolutions.com" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Web Design & SEO Agency London | TIA Software Solutions" />
          <meta property="og:description" content="Grow your business with custom websites, SEO, software development, and digital marketing. Serving clients throughout the UK. Free consultation available." />
          <meta property="og:image" content={OG_IMAGE} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Web Design & SEO Agency London | TIA Software Solutions" />
          <meta name="twitter:description" content="Grow your business with custom websites, SEO, software development, and digital marketing. Serving clients throughout the UK. Free consultation available." />
          <meta name="twitter:image" content={OG_IMAGE} />
        </Helmet>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="plans" element={<AdminPlans />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="seo" element={<AdminSEO />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <TiaChatbot />
        </BrowserRouter>
      </TooltipProvider>
    </GeoProvider>
  </QueryClientProvider>
);

export default App;
