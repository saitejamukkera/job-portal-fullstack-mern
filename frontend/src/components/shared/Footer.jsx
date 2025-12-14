import { Link } from "react-router-dom";
import { LuGithub, LuMail, LuMapPin } from "react-icons/lu";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-b from-background to-muted/30 border-t border-border mt-16">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1 text-center sm:text-left">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Job<span className="text-[#F83002]">Portal</span>
              </h2>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto sm:mx-0">
              Your trusted platform for finding the perfect job opportunity and
              building a successful career.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
                <LuMail className="size-4" />
                <span>support@jobportal.com</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
                <LuMapPin className="size-4" />
                <span>United States</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-base mb-4 text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/jobs", label: "Find Jobs" },
                { to: "/browse", label: "Browse All" },
                { to: "/view-profile", label: "My Profile" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-[#F83002] transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-base mb-4 text-foreground">
              For Employers
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/admin/companies", label: "Manage Companies" },
                { to: "/admin/jobs/create", label: "Post a Job" },
                { to: "/admin/jobs", label: "View Applications" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-[#6A38C2] transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-base mb-4 text-foreground">
              Connect With Us
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Follow us on social media for updates
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <Link
                to="https://github.com/mukkerasaiteja"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-muted/50 border border-border hover:bg-foreground hover:text-background transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <LuGithub className="size-5" />
              </Link>

              <Link
                to="https://x.com/mukkerasaiteja"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-muted/50 border border-border hover:bg-foreground hover:text-background transition-all duration-300 hover:scale-110"
                aria-label="X/Twitter"
              >
                <FaXTwitter className="size-5" />
              </Link>

              <Link
                to="https://www.linkedin.com/in/saiteja-mukkera/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-muted/50 border border-border hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5] transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="size-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {currentYear} JobPortal. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <span className="text-red-500 animate-pulse">❤️</span>{" "}
              by{" "}
              <Link
                to="https://github.com/mukkerasaiteja"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#6A38C2] hover:text-[#F83002] transition-colors"
              >
                Sai Teja
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
