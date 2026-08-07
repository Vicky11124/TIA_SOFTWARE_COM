import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useGeo } from "@/contexts/GeoContext";
import logo from "@/assets/logo.webp";

const serviceLinks = [
  { label: "Virtual Assistance", path: "/services/virtual-assistance" },
  { label: "Website Development", path: "/services/website-development" },
  { label: "App Development", path: "/services/app-development" },
  { label: "Software Development", path: "/services/software-development" },
  { label: "Branding Essentials", path: "/services/branding-essentials" },
  { label: "Digital Marketing", path: "/services/digital-marketing" },
  { label: "Creative Design", path: "/services/creative-design" },
  { label: "UI/UX Design", path: "/services/ui-ux-design" },
  { label: "Video & Motion Graphics", path: "/services/video-motion-graphics" },
  { label: "Stories & Reels Assets", path: "/services/stories-reels-assets" },
  { label: "Seasonal & Festive", path: "/services/seasonal-festive" },
  { label: "Event & Launch Graphics", path: "/services/event-launch-graphics" },
];

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services", hasDropdown: true },
  { label: "Plans", path: "/plans" },
  { label: "Blog", path: "/blog" },
  { label: "FAQ", path: "/faq" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { whatsappLink } = useSiteSettings();
  const { geo, setGeo } = useGeo();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-[88px]">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="TIA Software Solutions" className="h-20 md:h-24 mix-blend-multiply dark:mix-blend-normal" />
        </Link>

        {/* Geo selector */}
        <div className="flex items-center gap-1 ml-2 border border-border rounded-full p-0.5 bg-muted/30">
          <button
            onClick={() => setGeo("UK")}
            className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-all ${
              geo === "UK" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            UK
          </button>
          <button
            onClick={() => setGeo("US")}
            className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-all ${
              geo === "US" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            US
          </button>
          <button
            onClick={() => setGeo("AU")}
            className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-all ${
              geo === "AU" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            AU
          </button>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <div key={link.path} className="relative" ref={dropdownRef}>
                <button
                  className={`relative text-sm font-medium transition-colors duration-300 hover:text-foreground flex items-center gap-1 ${
                    location.pathname.startsWith("/services") ? "text-foreground" : "text-muted-foreground"
                  }`}
                  onClick={() => setServicesOpen(!servicesOpen)}
                  onMouseEnter={() => setServicesOpen(true)}
                >
                  {link.label}
                  <ChevronDown size={14} className={`transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`} />
                  {location.pathname.startsWith("/services") && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </button>
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-background border border-border rounded-xl shadow-lg overflow-hidden"
                      onMouseLeave={() => setServicesOpen(false)}
                    >
                      <div className="py-2">
                        <Link
                          to="/services"
                          className="block px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
                        >
                          All Services
                        </Link>
                        <div className="h-px bg-border mx-4 my-1" />
                        {serviceLinks.map((s) => (
                          <Link
                            key={s.path}
                            to={s.path}
                            className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                          >
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors duration-300 hover:text-foreground ${
                  location.pathname === link.path ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            )
          )}
        </div>

        <div className="hidden md:block">
          <Button variant="hero" size="lg" asChild>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              Get Started
            </a>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu - half screen */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 top-[88px] bg-foreground/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            {/* Menu panel - slides from right, half screen width */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="md:hidden fixed top-[88px] right-0 bottom-0 w-[70%] max-w-[300px] bg-background border-l border-border shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6 flex flex-col gap-4">
                {navLinks.map((link) =>
                  link.hasDropdown ? (
                    <div key={link.path}>
                      <button
                        className={`text-base font-medium transition-colors flex items-center gap-2 w-full ${
                          location.pathname.startsWith("/services") ? "text-foreground" : "text-muted-foreground"
                        }`}
                        onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      >
                        {link.label}
                        <ChevronDown size={16} className={`transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {mobileServicesOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 mt-2 space-y-2 overflow-hidden"
                          >
                            <Link to="/services" className="block text-sm text-muted-foreground hover:text-foreground py-1 font-medium">
                              All Services
                            </Link>
                            {serviceLinks.map((s) => (
                              <Link key={s.path} to={s.path} className="block text-sm text-muted-foreground hover:text-foreground py-1">
                                {s.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`text-base font-medium transition-colors ${
                        location.pathname === link.path ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                )}
                <Button variant="hero" size="lg" className="mt-4 w-full" asChild>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    Get Started
                  </a>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
