import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "How do I create a shipment?",
    a: "Visit our Create Shipment page, fill in your pickup and delivery details, package information, and preferred time. Our team will confirm your booking within minutes.",
  },
  {
    q: "How long does delivery take within Lagos?",
    a: "Same-day delivery is available for most Lagos locations when orders are placed before 2PM. Interstate deliveries typically take 1–3 business days depending on the destination.",
  },
  {
    q: "How can I track my shipment?",
    a: "You can track your shipment in real-time using the tracking ID provided when you create your shipment. Enter it on our Track Shipment page to see live status updates.",
  },
  {
    q: "What types of items can I ship?",
    a: "We handle documents, parcels, electronics, clothing, food items, and general merchandise. For fragile or high-value items, please contact us directly so we can provide appropriate packaging and handling.",
  },
  {
    q: "Do you offer international shipping?",
    a: "International shipping is coming soon! Currently, we operate across Lagos and provide interstate freight services across Nigeria. Stay tuned for our global expansion.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-6 py-20 box-border">
        <div className="flex flex-wrap gap-16 items-start">
          {/* Left: heading + CTA */}
          <div className="flex-[1_1_400px] flex flex-col gap-6">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-black/10 bg-black/4 font-mono text-xs text-slate-600 w-fit">
              Frequently Asked Questions
            </span>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-black text-[#001a3e] leading-[1.3] tracking-[-0.02em] m-0">
              Everything you need to know about shipping with ITRUST Rapid
              Logistics — from booking to delivery.
            </h2>
            <Link
              to="/create-shipment"
              className="inline-flex items-center px-6 py-3 bg-[#001a3e] text-white font-bold text-sm rounded-full no-underline w-fit transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0F2046]"
            >
              Create Shipment
            </Link>
          </div>

          {/* Right: accordion */}
          <div className="flex-[1.2_1_400px] flex flex-col gap-3">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden transition-colors duration-300 ${
                    isOpen ? "bg-[#001a3e]" : "bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  {/* Question */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 bg-transparent border-none cursor-pointer text-left"
                  >
                    <span
                      className={`text-[clamp(1rem,1.5vw,1.125rem)] font-bold leading-[1.3] transition-colors duration-300 ${
                        isOpen ? "text-white" : "text-[#001a3e]"
                      }`}
                    >
                      {faq.q}
                    </span>
                    <div className="shrink-0 w-7 h-7 flex items-center justify-center">
                      {isOpen ? (
                        <Minus size={18} className="text-white" />
                      ) : (
                        <Plus size={18} className="text-[#001a3e]" />
                      )}
                    </div>
                  </button>

                  {/* Answer */}
                  <div
                    className={`max-h-0 overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-125 opacity-100" : "opacity-0"
                    }`}
                  >
                    <p
                      className={`px-6 pb-6 text-sm leading-[1.6] m-0 ${
                        isOpen ? "text-white/70" : "text-slate-600"
                      }`}
                    >
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
