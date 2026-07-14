import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Adaeze Okonkwo",
    role: "E-commerce Vendor",
    company: "Ade Boutique, Lagos",
    text: "iTrust has been a game-changer for my business. Same-day deliveries mean my customers are always happy. Their tracking updates are spot on!",
    rating: 5,
    initials: "AO",
    color: "#FF6B35",
  },
  {
    name: "Chukwuemeka Nwosu",
    role: "Operations Manager",
    company: "Meridian Supplies Ltd",
    text: "We moved all our interstate freight to iTrust. The team is professional, responsive, and the packages always arrive on time without damage.",
    rating: 5,
    initials: "CN",
    color: "#3b82f6",
  },
  {
    name: "Funmilola Adeyemi",
    role: "Small Business Owner",
    company: "Funmi Cakes & Events",
    text: "Booking a pickup is so easy, and I can track everything in real-time. I love that they are a registered, trustworthy company.",
    rating: 5,
    initials: "FA",
    color: "#8b5cf6",
  },
  {
    name: "Babatunde Akinwale",
    role: "Procurement Officer",
    company: "Greenline Industries",
    text: "The Lagos operations team is fantastic — always available, quick to respond, and their pricing is transparent with no hidden fees.",
    rating: 4,
    initials: "BA",
    color: "#10b981",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const prev = () =>
    setActive((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () =>
    setActive((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  const t = testimonials[active];

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-6 py-20 box-border">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-black/10 bg-black/4 font-mono text-xs text-slate-600 mb-5">
            What Our Clients Say
          </span>
          <h2 className="text-[clamp(1.875rem,4vw,3rem)] font-black text-[#0B1B3D] tracking-[-0.02em] m-0 mb-3">
            Trusted by Hundreds Across Lagos
          </h2>
          <p className="text-slate-500 max-w-md mx-auto leading-[1.6]">
            Hear from businesses and individuals who rely on iTrust every day.
          </p>
        </div>

        {/* Card */}
        <div className="max-w-2xl mx-auto">
          <div className="relative bg-white rounded-3xl px-10 py-8 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] border border-black/5 min-h-70 box-border">
            {/* Decorative quote mark */}
            <span className="absolute top-5 right-7 text-[4.5rem] leading-none text-[rgba(249,115,22,0.1)] font-serif select-none pointer-events-none">
              "
            </span>

            {/* Stars */}
            <div className="flex gap-1 mb-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={
                    i < t.rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-200 fill-slate-200"
                  }
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-[clamp(1rem,2vw,1.125rem)] text-slate-700 leading-[1.6] mb-8 m-0 font-normal">
              "{t.text}"
            </blockquote>

            {/* Author + nav */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
                  style={{ backgroundColor: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-[#0B1B3D] text-sm m-0 mb-1">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-500 m-0">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#0B1B3D] cursor-pointer transition-colors duration-300 hover:bg-slate-200"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#0B1B3D] cursor-pointer transition-colors duration-300 hover:bg-slate-200"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-5">
            {testimonials.map((_, i) => {
              const isActive = i === active;
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  className={`h-1.5 rounded-full border-none cursor-pointer p-0 transition-all duration-300 ${
                    isActive
                      ? "w-7 bg-[#FF6B35]"
                      : "w-1.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
