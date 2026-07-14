import { useState } from "react";
import { Bike, Truck, Plane } from "lucide-react";

const solutions = [
  {
    num: "01",
    icon: Bike,
    title: "Fast Same-Day City Delivery",
    desc: "Rapid motorcycle delivery across Lagos for documents, parcels, and time-sensitive packages. Ideal for businesses, e-commerce vendors, and urgent dispatch needs.",
    cardBg: "#001a3e",
    numColor: "rgba(255, 255, 255, 0.1)",
    titleColor: "#fff",
    descColor: "rgba(255, 255, 255, 0.8)",
    iconBg: "rgba(255, 255, 255, 0.1)",
    iconColor: "#fff",
  },
  {
    num: "02",
    icon: Truck,
    title: "Reliable Ground Movement",
    desc: "Efficient last-mile delivery and interstate freight services across Nigeria, powered by a responsive Lagos-based operations team.",
    cardBg: "#e86b1c",
    numColor: "rgba(255, 255, 255, 0.2)",
    titleColor: "#fff",
    descColor: "rgba(255, 255, 255, 0.85)",
    iconBg: "rgba(255, 255, 255, 0.15)",
    iconColor: "#fff",
  },
  {
    num: "03",
    icon: Plane,
    title: "Speed When Time Matters",
    desc: "Fast, secure air cargo solutions for urgent domestic and international shipments, with streamlined customs clearance and real-time coordination.",
    cardBg: "#Fdfbf7",
    numColor: "rgba(11, 27, 61, 0.1)",
    titleColor: "#0B1B3D",
    descColor: "#475569",
    iconBg: "rgba(11, 27, 61, 0.08)",
    iconColor: "#0B1B3D",
  },
];

export default function Solutions() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="bg-white w-full">
      <div className="max-w-7xl mx-auto px-6 py-20 box-border">
        {/* Badge */}
        <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-black/10 bg-black/4 font-mono text-xs text-slate-600 mb-6">
          What iTrust Do
        </span>

        {/* Header */}
        <div className="flex flex-wrap items-end gap-6 mb-16">
          <h2 className="flex-[2_1_400px] text-[clamp(1.875rem,4vw,3rem)] font-black text-[#0B1B3D] leading-[1.1] m-0">
            Complete Logistics Solutions.
            <br />
            One Reliable Partner.
          </h2>
          <p className="flex-[1_1_300px] text-[clamp(0.875rem,1.5vw,1rem)] text-slate-500 leading-[1.6] m-0">
            From urgent parcels to full-scale freight operations, we move cargo
            safely, quickly, and professionally — across Lagos, Nigeria, and
            internationally (coming soon).
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap gap-7 justify-center">
          {solutions.map((item, index) => {
            const Icon = item.icon;
            const isHovered = hoveredIndex === index;
            return (
              <div
                key={item.num}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex-[1_1_300px] rounded-[1.75rem] overflow-hidden flex flex-col transition-all duration-500 cursor-default box-border min-h-100"
                style={{
                  backgroundColor: item.cardBg,
                  transform: isHovered ? "translateY(-8px)" : "none",
                  boxShadow: isHovered
                    ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                    : "none",
                }}
              >
                {/* Card header */}
                <div className="px-7 pt-7">
                  <span
                    className="font-mono font-black text-[3rem] block leading-none mb-4"
                    style={{ color: item.numColor }}
                  >
                    {item.num}
                  </span>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: item.iconBg }}
                  >
                    <Icon size={24} style={{ color: item.iconColor }} />
                  </div>
                  <h3
                    className="text-xl font-bold m-0"
                    style={{ color: item.titleColor }}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="px-7 py-5 flex-1">
                  <p
                    className="text-sm leading-[1.6] m-0"
                    style={{ color: item.descColor }}
                  >
                    {item.desc}
                  </p>
                </div>

                {/* Bottom illustration strip */}
                <div className="relative h-36 mt-auto overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-15">
                    <Icon
                      size={120}
                      style={{ color: item.iconColor }}
                      strokeWidth={0.8}
                    />
                  </div>
                  <div
                    className={`absolute inset-0 bg-linear-to-t from-black/20 to-transparent transition-opacity duration-300 ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
