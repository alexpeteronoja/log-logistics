import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Phone, Menu, X, ChevronDown } from "lucide-react";

const InstagramIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const navLinks = [
  { to: "/about", label: "About" },
  { to: "/track-parcel", label: "Track shipment" },
  { to: "/contact", label: "Contact" },
  { to: "/admin", label: "Admin Login" },
];

const socials = [
  {
    href: "https://www.instagram.com/itrustrapidlogistics",
    icon: InstagramIcon,
  },
  {
    href: "https://www.linkedin.com/company/itrustrapidlogistics",
    icon: LinkedinIcon,
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Desktop / Tablet Nav ── */}
      <nav className="sticky top-0 z-50 w-full bg-[rgba(253,251,247,0.9)] lg:bg-[#fffc] backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-4 sm:py-6 flex items-center justify-between gap-4 box-border">
          {/* Logo + Desktop links */}
          <div className="flex items-center gap-12">
            <Link
              to="/"
              className="flex items-center gap-2 shrink-0 no-underline"
            >
              <div className="w-9 h-9 rounded-lg bg-[#e86b1c] flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <span className="font-black text-lg text-[#0B1B3D] tracking-[-0.02em]">
                i<span className="text-[#e86b1c]">TRUST</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="desktop-links flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `no-underline text-sm font-medium transition-colors duration-200 ${
                      isActive ? "text-[#e86b1c]" : "text-slate-600"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right: Contact + Phone + Hamburger */}
          <div className="flex items-center gap-3">
            {/* Contact us pill */}
            <Link to={"/contact"}>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[rgba(249,115,22,0.1)] text-[#e86b1c] text-sm font-semibold border-none cursor-pointer transition-colors duration-300 hover:bg-[rgba(249,115,22,0.2)]">
                Contact us
                <ChevronDown size={14} className="opacity-70" />
              </button>
            </Link>

            {/* Phone */}
            <div className="desktop-phone flex items-center gap-3 border-l border-black/8 pl-6 ml-3">
              <div className="w-10 h-10 rounded-full bg-[#e86b1c] flex items-center justify-center shrink-0">
                <Phone size={16} color="white" fill="white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  24/7 Support
                </span>
                <span className="text-[15px] font-bold text-[#e86b1c] whitespace-nowrap">
                  (+234)-903-487-3882
                </span>
              </div>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="mobile-hamburger hidden w-11 h-11 items-center justify-center bg-[#0B1B3D] text-white rounded-lg border-none cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Adding a style tag to handle the display none properties since inline styles can't do media queries easily */}
      <style>{`
        @media (max-width: 1024px) {
          .desktop-links { display: none !important; }
          .mobile-hamburger { display: flex !important; }
        }
        @media (max-width: 768px) {
          .desktop-phone { display: none !important; }
        }
      `}</style>

      {/* ── Mobile overlay ── */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-998 bg-black/30 transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── Mobile drawer ── */}
      <div
        className={`fixed inset-0 z-999 bg-[#Fdfbf7] flex flex-col h-max rounded-b-3xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end p-5">
          <button
            onClick={() => setMobileOpen(false)}
            className="w-11 h-11 flex items-center justify-center bg-[#0B1B3D] text-white rounded-lg border-none cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col items-center justify-center gap-8 px-6 py-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="text-[2.25rem] font-black text-[#0B1B3D] no-underline transition-colors duration-300 hover:text-[#e86b1c]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Social + copyright */}
        <div className="p-10 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            {socials.map(({ href, icon: Icon }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-lg border border-[#e86b1c] flex items-center justify-center text-[#e86b1c] no-underline transition-all duration-300 hover:bg-[#e86b1c] hover:text-white"
              >
                <Icon />
              </a>
            ))}
          </div>
          <p className="text-[10px] font-bold text-[rgba(11,27,61,0.35)] uppercase tracking-widest m-0">
            © {new Date().getFullYear()} ITRUST RAPID LOGISTICS.
          </p>
        </div>
      </div>
    </>
  );
}
