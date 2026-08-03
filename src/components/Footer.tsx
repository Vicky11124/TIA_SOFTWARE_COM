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
                className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href={settings.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
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
            <h4 className="font-semibold mb-4">Services</h4>
            <div className="flex flex-col gap-3">
              {[
                { label: "Virtual Assistance", path: "/services/virtual-assistance" },
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
            <h4 className="font-semibold mb-4">Contact</h4>
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
