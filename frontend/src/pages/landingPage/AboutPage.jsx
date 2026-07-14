import { ArrowRight, Check } from "lucide-react";
import Footer from "../../components/Footer";
import LandingNavbar from "../../components/navbar/LandingNavbar";
import { CheckItems, ContactItemData, CoreValuesData, FormFieldData, MissionStats, TeamData, } from "../../components/AboutPage/AboutPageData";
// ─── Types ──────────────────────────────────────────────────────
// ─── Section Tag ────────────────────────────────────────────────
const SectionTag = ({ children }) => (<span className="mb-4 inline-block rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-orange-500">
    {children}
  </span>);
// ─── About Page ─────────────────────────────────────────────────
const AboutPage = () => {
    return (<>
      <LandingNavbar />

      <div className="bg-slate-100 font-sans">
        {/* ── Hero ─────────────────────────────────────────────── */}
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
            <SectionTag>Our Story</SectionTag>

            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
              We Exist to Move{" "}
              <span className="text-orange-500">Nigeria Forward</span>
            </h1>

            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/70">
              SwiftEx was founded in 2018 with a single belief: that every
              Nigerian business and individual deserves a courier service they
              can actually trust.
            </p>
          </div>
        </section>

        {/* ── Mission ──────────────────────────────────────────── */}
        <section className="bg-slate-100 px-[5%] py-24">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
            {/* Left */}
            <div>
              <SectionTag>Our Mission</SectionTag>

              <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-primary">
                Logistics That{" "}
                <span className="text-orange-500">Actually Works</span>
              </h2>

              <p className="mb-5 leading-8 text-gray-500">
                We started SwiftEx after personally experiencing the
                frustrations of unreliable deliveries, lost packages, and zero
                visibility into where a shipment actually was.
              </p>

              <p className="mb-8 leading-8 text-gray-500">
                Our mission is simple: build the most dependable courier
                infrastructure in Nigeria.
              </p>

              <div className="space-y-4">
                {CheckItems.map((item, i) => (<div key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500">
                      <Check size={12} className="text-white"/>
                    </div>

                    <span className="text-sm text-gray-700">{item.text}</span>
                  </div>))}
              </div>
            </div>

            {/* Right */}
            <div className="grid grid-cols-2 gap-5">
              {MissionStats.map((s, i) => (<div key={i} className={`rounded-2xl border-t-4 bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${i % 2 === 0 ? "border-primary" : "border-orange-500"}`}>
                  <p className={`mb-2 text-4xl font-extrabold ${i % 2 === 0 ? "text-primary" : "text-orange-500"}`}>
                    {s.value}
                  </p>

                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>))}
            </div>
          </div>
        </section>

        {/* ── Values ───────────────────────────────────────────── */}
        <section className="bg-white px-[5%] py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <SectionTag>What Drives Us</SectionTag>

              <h2 className="text-4xl font-extrabold tracking-tight text-primary">
                Our Core <span className="text-orange-500">Values</span>
              </h2>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {CoreValuesData.map((v, i) => {
            const Icon = v.icon;
            return (<div key={i} className={`rounded-2xl border-l-4 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${i % 2 === 0 ? "border-primary" : "border-orange-500"}`}>
                    <div className="mb-4">
                      <Icon size={28} className={i % 2 === 0 ? "text-primary" : "text-orange-500"}/>
                    </div>

                    <h3 className="mb-3 text-lg font-bold text-primary">
                      {v.title}
                    </h3>

                    <p className="text-sm leading-7 text-gray-500">{v.desc}</p>
                  </div>);
        })}
            </div>
          </div>
        </section>

        {/* ── Team ─────────────────────────────────────────────── */}
        <section className="bg-slate-100 px-[5%] py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <SectionTag>The People</SectionTag>

              <h2 className="text-4xl font-extrabold tracking-tight text-primary">
                Meet the <span className="text-orange-500">Leadership</span>
              </h2>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {TeamData.map((m, i) => (<div key={i} className="rounded-2xl bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-primary to-orange-500">
                    <span className="text-lg font-extrabold text-white">
                      {m.initial}
                    </span>
                  </div>

                  <h3 className="mb-1 text-lg font-bold text-primary">
                    {m.name}
                  </h3>

                  <p className="text-sm text-gray-500">{m.role}</p>
                </div>))}
            </div>
          </div>
        </section>

        {/* ── Contact ──────────────────────────────────────────── */}
        <section className="bg-white px-[5%] py-24">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
            {/* Contact Info */}
            <div>
              <SectionTag>Get In Touch</SectionTag>

              <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-primary">
                We'd Love to{" "}
                <span className="text-orange-500">Hear from You</span>
              </h2>

              <div className="space-y-5">
                {ContactItemData.map((c, i) => {
            const Icon = c.icon;
            return (<div key={i} className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Icon size={20} className="text-primary"/>
                      </div>

                      <div>
                        <p className="mb-1 text-sm text-gray-500">{c.label}</p>

                        <p className="font-medium text-gray-800">{c.value}</p>
                      </div>
                    </div>);
        })}
              </div>
            </div>

            {/* Form */}
            <div className="rounded-2xl bg-white p-9 shadow-sm">
              <h3 className="mb-6 text-xl font-bold text-primary">
                Send a Message
              </h3>

              <div className="space-y-4">
                {FormFieldData.map((f) => (<input key={f} placeholder={f} className="w-full rounded-xl border border-gray-200 px-4 py-4 text-sm outline-none transition focus:border-orange-500"/>))}

                <textarea placeholder="Your message..." rows={4} className="w-full resize-y rounded-xl border border-gray-200 px-4 py-4 text-sm outline-none transition focus:border-orange-500"/>

                <button className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-4 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-orange-400 hover:shadow-lg">
                  Send Message
                  <ArrowRight size={18}/>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>);
};
export default AboutPage;
