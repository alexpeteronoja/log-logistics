import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";

const InstagramIcon = () => (
  <svg
    width="16"
    height="16"
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
    width="16"
    height="16"
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

const footerLinks = [
  {
    title: "Quick links",

    links: [
      { label: "About Us", to: "/" },
      { label: "Our Services", to: "/services" },
      { label: "Track Shipment", to: "/track-parcel" },
    ],
  },
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

const contactInfo = [
  { icon: MapPin, text: "Lagos, Nigeria" },
  { icon: Phone, text: "(+234)-903-487-3882" },
  { icon: Mail, text: "info@itrustrapidlogistics.com" },
];

export default function Footer() {
  return (
    <footer className="bg-[#001a3e] text-white/60 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 box-border">
        {/* ── CTA Banner ── */}
        <div className="relative overflow-hidden bg-linear-to-r from-[#e86b1c] to-[#ea580c] rounded-[1.75rem] p-10 mb-16 flex flex-wrap items-center justify-between gap-6 box-border">
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -bottom-12 left-[33%] w-52 h-52 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10 flex-[1_1_300px]">
            <h3 className="text-[clamp(1.5rem,3vw,1.875rem)] font-black text-white mb-1.5 m-0">
              Ready to Ship with iTrust?
            </h3>
            <p className="text-white/80 text-sm leading-[1.6] m-0">
              Fast, secure, and reliable logistics across Lagos and Nigeria.
            </p>
          </div>

          <div className="relative z-10 flex gap-3 flex-wrap">
            <Link
              to="/create-shipment"
              className="flex items-center gap-2 px-6 py-3 bg-white text-[#e86b1c] font-bold text-sm rounded-full no-underline transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Create Shipment
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/tracking"
              className="px-6 py-3 bg-white/15 border border-white/30 text-white font-semibold text-sm rounded-full no-underline transition-all duration-300 hover:bg-white/25"
            >
              Track Shipment
            </Link>
          </div>
        </div>

        {/* ── Footer Grid ── */}
        <div className="flex flex-wrap gap-10 mb-12">
          {/* Brand column */}
          <div className="flex-[1.5_1_250px]">
            <Link to="/" className="flex items-center gap-2 no-underline mb-5">
              <div className="w-9 h-9 rounded-lg bg-[#e86b1c] flex items-center justify-center shrink-0">
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
              <span className="font-black text-lg text-white tracking-[-0.02em]">
                i<span className="text-[#e86b1c]">TRUST</span>
              </span>
            </Link>

            <p className="text-2xl leading-[1.6] text-white max-w-[20rem] mb-6 m-0">
              Global Logistics Company.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((section) => (
            <div key={section.title} className="flex-[1_1_150px]">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4 m-0">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/55 no-underline transition-colors duration-300 hover:text-[#e86b1c]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex-[1.5_1_250px]">
            <span className="font-black text-lg text-white tracking-[-0.02em]">
              Reach Us
            </span>

            <p className="text-sm leading-[1.6] max-w-[20rem] mb-6 m-0">
              Reliable logistics solutions for businesses and individuals across
              Lagos, Nigeria, and beyond.
            </p>

            <div className="flex flex-col gap-3 text-sm">
              {contactInfo.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <Icon size={14} className="text-[#e86b1c] shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/8 pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest m-0">
            © {new Date().getFullYear()} ITRUST RAPID LOGISTICS. All rights
            reserved.
          </p>

          <div className="flex gap-2">
            {socials.map(({ href, icon: Icon }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg border border-white/12 flex items-center justify-center text-white/50 no-underline transition-all duration-300 hover:border-[#e86b1c] hover:text-[#e86b1c] hover:bg-[rgba(249,115,22,0.1)]"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
