import { ShieldCheck, Expand, Timer, Users, Globe } from "lucide-react";

const leftFeatures = [
  {
    icon: ShieldCheck,
    title: "Registered & Verified",
    desc: "Fully registered under Company Reg No: 9245503. Committed to compliance and operational transparency.",
  },
  {
    icon: Expand,
    title: "Transparent Shipment Updates",
    desc: "Clear tracking milestones from pickup to delivery.",
  },
];

const rightFeatures = [
  {
    icon: Timer,
    title: "Fast Response Time",
    desc: "Quick confirmations, efficient scheduling, and real-time communication.",
  },
  {
    icon: Users,
    title: "Dedicated Lagos Operations Team",
    desc: "Trained teams to carry out both admin and operational services tailored to your satisfaction.",
  },
];

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-slate-100 rounded-4xl p-6 flex flex-col gap-4 min-h-50 justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] box-border">
      <div className="w-10 h-10 rounded-xl bg-[rgba(11,27,61,0.08)] flex items-center justify-center">
        <Icon size={22} className="text-[#001a3e]" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-[#001a3e] m-0">{title}</h3>
        <p className="text-sm text-[rgba(11,27,61,0.65)] leading-[1.6] m-0">
          {desc}
        </p>
      </div>
    </div>
  );
}

function CenterVisual() {
  return (
    <div className="w-full min-h-105 bg-linear-to-br from-[#0F2046] to-[#0A1630] rounded-4xl flex items-center justify-center relative overflow-hidden">
      {/* Decorative rings */}
      <div className="absolute w-[288px] h-72 rounded-full border border-white/8" />
      <div className="absolute w-52 h-52 rounded-full border border-[rgba(249,115,22,0.2)]" />
      <div className="absolute w-32 h-32 rounded-full border border-white/6" />

      {/* Globe icon */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-[rgba(249,115,22,0.15)] border border-[rgba(249,115,22,0.3)] flex items-center justify-center">
          <Globe size={40} className="text-[#e86b1c]" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-white font-bold text-lg">200+ Clients</span>
          <span className="text-white/40 text-xs font-mono">
            Lagos-Based Operations
          </span>
        </div>
      </div>

      {/* Floating badges */}
      <div className="absolute top-5 left-5 bg-[rgba(249,115,22,0.9)] rounded-xl px-3 py-1.5">
        <span className="text-white text-xs font-bold">🇳🇬 Lagos, Nigeria</span>
      </div>
      <div className="absolute bottom-5 right-5 bg-white/8 backdrop-blur-sm border border-white/12 rounded-xl px-3 py-1.5">
        <span className="text-white text-xs font-semibold">
          Reg No: 9245503
        </span>
      </div>

      {/* Route dots */}
      <div className="absolute top-[33.33%] left-8 w-2.5 h-2.5 rounded-full bg-[rgba(249,115,22,0.7)]" />
      <div className="absolute bottom-[33.33%] right-8 w-2.5 h-2.5 rounded-full bg-[rgba(249,115,22,0.7)]" />
      <div className="absolute top-[33.33%] left-8 w-5 h-5 rounded-full border border-[rgba(249,115,22,0.3)] -translate-x-1/4 -translate-y-1/4" />
    </div>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-6 py-20 box-border">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-black/10 bg-black/4 font-mono text-xs text-slate-600 mb-5">
            Why Choose iTrust
          </span>
          <h2 className="text-[clamp(2.25rem,5vw,3.75rem)] font-black text-[#001a3e] leading-[1.1] tracking-[-0.02em] m-0 mb-4">
            Built on Trust. Driven by
            <br />
            Performance.
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg leading-[1.6]">
            Trusted by businesses, retailers, and independent shippers across
            Lagos.
          </p>
        </div>

        {/* 3-column grid */}
        <div className="flex flex-wrap gap-8 items-center justify-center">
          {/* Left features */}
          <div className="flex-[1_1_300px] flex flex-col gap-6">
            {leftFeatures.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>

          {/* Center visual */}
          <div className="flex-[1.2_1_350px]">
            <CenterVisual />
          </div>

          {/* Right features */}
          <div className="flex-[1_1_300px] flex flex-col gap-6">
            {rightFeatures.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
