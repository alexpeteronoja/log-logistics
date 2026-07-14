import { useState, useEffect } from "react";
import { ClipboardList, PackageCheck, MapPin } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: ClipboardList,
    title: "Create Shipment",
    desc: "Provide pickup, delivery, and package information through our smart shipment form. It takes less than 2 minutes.",
  },
  {
    num: "02",
    icon: PackageCheck,
    title: "We Pick & Prepare",
    desc: "Our operations team confirms your request and schedules a pickup at your preferred time and location, and prepares it for delivery.",
  },
  {
    num: "03",
    icon: MapPin,
    title: "Track in Real-Time",
    desc: "Monitor your shipment from pickup to delivery with live status updates and location tracking.",
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((s) => (s + 1) % steps.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#001a3e] text-white rounded-3xl mx-3 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[25%] w-96 h-96 bg-[rgba(249,115,22,0.08)] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-[25%] w-80 h-80 bg-white/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 box-border">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/8 font-mono text-xs text-white mb-5">
            How it works
          </span>
          <h2 className="text-[clamp(1.875rem,4vw,3rem)] font-black mb-4 tracking-[-0.02em] m-0">
            Shipping Made Simple
          </h2>
          <p className="text-white/50 max-w-md mx-auto leading-[1.6]">
            Create, schedule, and monitor your shipment in minutes.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {steps.map((step, i) => {
            const isActive = i === activeStep;
            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(i)}
                className={`px-5 py-2 rounded-full font-mono text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-[#e86b1c] text-white border border-[#e86b1c]"
                    : "bg-transparent text-white/50 border border-white/15 hover:text-white/80 hover:border-white/30"
                }`}
              >
                {step.num} — {step.title}
              </button>
            );
          })}
        </div>

        {/* Active step card */}
        <div className="max-w-2xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === activeStep;
            return (
              <div
                key={step.num}
                className={`${
                  isActive ? "flex" : "hidden"
                } flex-col items-center bg-white/4 backdrop-blur-2xl rounded-3xl p-12 border border-white/8 box-border`}
              >
                {/* Big faded number */}
                <span className="font-mono font-black text-[clamp(3.75rem,8vw,4.5rem)] text-white/10 leading-none mb-6 select-none">
                  {step.num}
                </span>

                {/* Icon circle */}
                <div className="w-16 h-16 rounded-2xl bg-[rgba(249,115,22,0.2)] flex items-center justify-center mb-5">
                  <Icon size={30} className="text-[#e86b1c]" />
                </div>

                <h3 className="text-[clamp(1.5rem,3vw,1.875rem)] font-bold text-center mb-4 m-0">
                  {step.title}
                </h3>
                <p className="text-white/55 leading-[1.6] text-center max-w-md mb-10 m-0">
                  {step.desc}
                </p>

                {/* Visual placeholder — icon watermark */}
                <div className="w-full aspect-video max-w-lg rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center overflow-hidden">
                  <Icon
                    size={100}
                    className="text-[rgba(249,115,22,0.25)]"
                    strokeWidth={0.6}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {steps.map((_, i) => {
            const isActive = i === activeStep;
            return (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                aria-label={`Step ${i + 1}`}
                className={`h-1.5 rounded-full border-none cursor-pointer transition-all duration-300 p-0 ${
                  isActive
                    ? "w-8 bg-[#e86b1c]"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
