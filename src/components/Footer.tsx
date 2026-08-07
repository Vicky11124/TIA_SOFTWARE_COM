import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone, MapPin, Linkedin } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import logo from "@/assets/logo.webp";

const Footer = () => {
  const { settings, whatsappLink } = useSiteSettings();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <img src={logo} alt="TIA Software Solutions" className="h-10 mb-2 mix-blend-multiply dark:mix-blend-normal" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              We help brands grow smarter, faster, and stronger in the digital world.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href={settings.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://x.com/tiasoftwares"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-base mb-4 text-foreground">Quick Links</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: "Home", path: "/" },
                { label: "About Us", path: "/about" },
                { label: "Services", path: "/services" },
                { label: "Plans", path: "/plans" },
                { label: "Blog", path: "/blog" },
                { label: "FAQ", path: "/faq" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-base mb-4 text-foreground">Services</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: "Virtual Assistance", path: "/services/virtual-assistance" },
                { label: "Website Development", path: "/services/website-development" },
                { label: "App Development", path: "/services/app-development" },
                { label: "Software Development", path: "/services/software-development" },
                { label: "Branding Essentials", path: "/services/branding-essentials" },
                { label: "Digital Marketing", path: "/services/digital-marketing" },
                { label: "Creative Design", path: "/services/creative-design" },
                { label: "UI/UX Design", path: "/services/ui-ux-design" },
              ].map((s) => (
                <Link key={s.path} to={s.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-base mb-4 text-foreground">Contact</h3>
            <div className="flex flex-col gap-4">
              <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail size={16} />
                {settings.email}
              </a>
              <a href={`tel:${settings.phone}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone size={16} />
                {settings.phone}
              </a>
              <span className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin size={16} />
                {settings.address}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TIA Software Solutions. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
