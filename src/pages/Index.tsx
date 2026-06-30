import { Helmet } from "react-helmet-async";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import ServicesHighlight from "@/components/ServicesHighlight";
import AboutPreview from "@/components/AboutPreview";
import WorkShowcase from "@/components/WorkShowcase";
import ProcessSection from "@/components/ProcessSection";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  const { settings } = useSiteSettings();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.tiasoftwaresolutions.com/#organization",
    "name": "TIA Software Solutions",
    "url": "https://www.tiasoftwaresolutions.com",
    "logo": "https://www.tiasoftwaresolutions.com/favicon.webp",
    "sameAs": [
      settings.instagram_url,
      settings.facebook_url
    ].filter(Boolean),
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": settings.phone,
      "contactType": "sales",
      "email": settings.email
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.tiasoftwaresolutions.com/#localbusiness",
    "name": "TIA Software Solutions",
    "image": "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3f4bcd31-a5c1-420a-b200-e811caec0b6d/id-preview-3a79d4ef--48407ef1-b28b-4b4e-bac1-aaad364a1361.lovable.app-1774944538908.png",
    "url": "https://www.tiasoftwaresolutions.com",
    "telephone": settings.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings.address || "London",
      "addressLocality": "London",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.5074,
      "longitude": -0.1278
    },
    "priceRange": "$$"
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>
      <h1 className="sr-only">Digital Marketing & Website Development Company — TIA Software Solutions</h1>
      <Navbar />
      <HeroCarousel />
      <ServicesHighlight />
      <AboutPreview />
      <WorkShowcase />
      <ProcessSection />
      <StatsSection />
      <FAQSection preview={true} />
      <CTASection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
