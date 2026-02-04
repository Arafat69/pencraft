import { Link } from "react-router-dom";
import { Twitter, Linkedin, Github, Instagram, Mail } from "lucide-react";

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "GitHub", icon: Github, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
];

const footerLinks = {
  explore: [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "Authors", href: "/authors" },
  ],
  shop: [
    { name: "All Products", href: "/shop" },
    { name: "My Cart", href: "/cart" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container-blog py-8 lg:py-16">
        {/* Brand Section */}
        <div className="mb-8 lg:mb-12">
          <Link to="/" className="flex items-center gap-3 mb-4 group">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center shadow-lg shadow-accent/25">
              <span className="text-primary-foreground font-display font-bold text-xl lg:text-2xl">
                A
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg lg:text-xl font-bold text-foreground">
                Arafat Rahman Dihan
              </span>
              <span className="text-[10px] lg:text-xs text-muted-foreground font-medium uppercase tracking-widest">
                Writer • Developer • Creator
              </span>
            </div>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
            A personal space for sharing thoughts on design, technology, and creative projects.
          </p>
        </div>

        {/* Links - 3 columns on mobile */}
        <div className="grid grid-cols-3 gap-4 lg:gap-12 mb-8">
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm lg:text-base">Explore</h4>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm lg:text-base">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm lg:text-base">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter & Social */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 pt-6 border-t border-border">
          <div className="flex-1 max-w-md">
            <h4 className="font-semibold text-foreground mb-3 text-sm lg:text-base">
              Stay Updated
            </h4>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 lg:px-4 py-2 text-sm bg-secondary rounded-md border-none outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="px-3 lg:px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Social Links */}
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label={social.name}
              >
                <social.icon className="h-4 w-4 lg:h-5 lg:w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Arafat Rahman Dihan. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <a
              href="mailto:hello@pencraft.blog"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4" />
              Contact
            </a>
            <Link to="/admin-login" className="hover:text-foreground transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
