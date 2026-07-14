import { ArrowRight, MapPin } from "lucide-react";
import Footer from "../../components/Footer";
import LandingNavbar from "../../components/navbar/LandingNavbar";
import { FAQItem } from "../../components/contact/FAQItem";
import { ChannelsData, FaqsData, ReachOptionsData, } from "../../components/contact/ContactData";
import { NavLink } from "react-router-dom";
// ─── Sub-components ──────────────────────────────────────────────────────────
const SectionTag = ({ children }) => (<span className="mb-4 inline-block rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-orange-500">
    {children}
  </span>);
// ─── Contact Page ────────────────────────────────────────────────────────────
const Contact = () => {
    return (<>
      <LandingNavbar />

      <div className="bg-slate-100 font-sans">
        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-linear-to-br from-[#160f55] to-primary px-[5%] py-24">
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="white"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)"/>
            </svg>
          </div>

          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <SectionTag>Contact Us</SectionTag>

            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
              We're Here{" "}
              <span className="text-orange-500">When You Need Us</span>
            </h1>

            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/70">
              Have a question, a shipment concern, or a business inquiry? Reach
              out through any channel below a real person will get back to you
              fast.
            </p>
          </div>
        </section>

        {/* ── Channel Cards ─────────────────────────────────────────────────── */}
        <section className="px-[5%] py-16">
          <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ChannelsData.map((c, i) => {
            const Icon = c.icon;
            return (<div key={i} className={`rounded-2xl border-t-4 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${i % 2 === 0 ? "border-primary" : "border-orange-500"}`}>
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${i % 2 === 0 ? "bg-primary/10" : "bg-orange-500/10"}`}>
                    <Icon size={20} className={i % 2 === 0 ? "text-primary" : "text-orange-500"}/>
                  </div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">
                    {c.label}
                  </p>
                  <p className="mb-1 font-bold text-primary">{c.value}</p>
                  <p className="text-xs text-gray-500">{c.sub}</p>
                </div>);
        })}
          </div>
        </section>

        {/* ── Main Form + Quick Reach ───────────────────────────────────────── */}
        <section className="bg-white px-[5%] py-24">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-start">
            {/* Left — Form */}
            <div className="rounded-2xl bg-slate-50 p-10 shadow-sm">
              <SectionTag>Send a Message</SectionTag>

              <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-primary">
                Tell Us What <span className="text-orange-500">You Need</span>
              </h2>
              <p className="mb-8 text-sm leading-7 text-gray-500">
                Fill in the form and we'll get back to you within 2 hours on
                business days.
              </p>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input placeholder="First name" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-500"/>
                  <input placeholder="Last name" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-500"/>
                </div>

                <input placeholder="Email address" type="email" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-500"/>

                <input placeholder="Phone number" type="tel" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-500"/>

                <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm text-gray-500 outline-none transition focus:border-orange-500 appearance-none">
                  <option value="" disabled selected>
                    What's this about?
                  </option>
                  <option>Shipment Issue</option>
                  <option>Delivery Inquiry</option>
                  <option>Corporate / Business</option>
                  <option>Billing</option>
                  <option>Other</option>
                </select>

                <textarea placeholder="Describe your issue or question..." rows={5} className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-500"/>

                <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-4 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-orange-400 hover:shadow-lg">
                  Send Message
                  <ArrowRight size={18}/>
                </button>
              </div>
            </div>

            {/* Right — Quick Reach */}
            <div>
              <SectionTag>Quick Reach</SectionTag>

              <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-primary">
                Prefer a <span className="text-orange-500">Faster Route?</span>
              </h2>

              <p className="mb-10 text-sm leading-7 text-gray-500">
                Skip the form and use one of these options to get help
                immediately.
              </p>

              <div className="space-y-5">
                {ReachOptionsData.map((opt, i) => {
            const Icon = opt.icon;
            return (<div key={i} className={`flex items-start gap-5 rounded-2xl border p-7 shadow-sm  ${opt.accent
                    ? "border-orange-500/30 bg-orange-500/5"
                    : "border-gray-100 bg-white"}`}>
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${opt.accent ? "bg-orange-500" : "bg-primary/10"}`}>
                        <Icon size={22} className={opt.accent ? "text-white" : "text-primary"}/>
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 font-bold text-primary">
                          {opt.title}
                        </h3>
                        <p className="mb-4 text-sm leading-6 text-gray-500">
                          {opt.desc}
                        </p>

                        <NavLink to={opt.buttonLink}>
                          <button className={`inline-flex items-center gap-2 rounded-xl cursor-pointer px-5 py-2.5 text-sm font-bold transition duration-300 hover:-translate-y-0.5 ${opt.accent
                    ? "bg-orange-500 text-white hover:bg-orange-400"
                    : "bg-primary text-white hover:bg-primary/80"}`}>
                            {opt.cta}
                            <ArrowRight size={15}/>
                          </button>
                        </NavLink>
                      </div>
                    </div>);
        })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Map Placeholder ───────────────────────────────────────────────── */}
        <section className="px-[5%] py-16">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl shadow-sm">
            <div className="relative flex h-72 items-center justify-center bg-linear-to-br from-[#160f55] to-primary">
              {/* Dot pattern */}
              <div className="absolute inset-0 opacity-5">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="dots2" width="30" height="30" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1.5" fill="white"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#dots2)"/>
                </svg>
              </div>

              <div className="relative z-10 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500">
                  <MapPin size={26} className="text-white"/>
                </div>
                <p className="font-bold text-white">
                  22 Baker Street Marylebone, London
                </p>
                <p className="text-sm text-white/60">London UK</p>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-orange-400">
                  Open in Google Maps
                  <ArrowRight size={15}/>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQs ──────────────────────────────────────────────────────────── */}
        <section className="bg-white px-[5%] py-24">
          <div className="mx-auto max-w-3xl">
            <div className="mb-14 text-center">
              <SectionTag>FAQ</SectionTag>
              <h2 className="text-4xl font-extrabold tracking-tight text-primary">
                Common <span className="text-orange-500">Questions</span>
              </h2>
            </div>

            <div className="space-y-4">
              {FaqsData.map((faq, i) => (<FAQItem key={i} faq={faq} index={i}/>))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>);
};
export default Contact;
