import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function Hero() {
  const [trackingId, setTrackingId] = useState("");

  return (
    <section className="w-full md:p-6 lg:p-12.5 p-0 box-border">
      <div className="relative md:rounded-[2.5rem] overflow-hidden min-h-[90vh] flex flex-col justify-end bg-[#Fdfbf7]">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-image.png"
            alt="Logistics Warehouse"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-[rgba(11,27,61,0.95)] via-[rgba(11,27,61,0.55)] to-[rgba(11,27,61,0.15)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full pb-10 pt-24 box-border">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-10 items-end justify-between box-border">
            {/* Left: Headline */}
            <div className="max-w-2xl text-white flex flex-col gap-5 mb-8">
              <h1 className="text-[clamp(2.25rem,5vw,4.5rem)] font-black leading-[1.08] tracking-[-0.02em] m-0">
                Global Logistics
                <br />
                Simplified. Delivered
                <br />
                with Trust.
              </h1>
              <p className="text-[clamp(1rem,2vw,1.25rem)] text-white/75 max-w-md leading-[1.6] m-0">
                Reliable Air, Road & Ocean freight solutions for businesses and
                individuals across Lagos and beyond.
              </p>

              {/* Trusted by */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex">
                  {["AO", "JW", "FK", "CM"].map((initials, i) => (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold text-white box-border`}
                      style={{
                        marginLeft: i > 0 ? "-10px" : "0",
                        background: `hsl(${20 + i * 40}, 70%, ${55 + i * 5}%)`,
                      }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <p className="text-sm font-semibold text-[#e86b1c] m-0">
                  Trusted by over 200 people
                </p>
              </div>
            </div>

            {/* Right: Tracking form */}
            <div className="w-full max-w-md shrink-0">
              <div className="bg-[#001a3e] backdrop-blur-lg rounded-4xl p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/30 box-border">
                {/* Tabs */}
                <div className="bg-white rounded-full p-1 flex mb-6">
                  <button className="flex-1 h-12 px-4 rounded-full bg-[#e86b1c] text-white font-bold text-sm border-none cursor-pointer transition-all duration-300">
                    Track shipment
                  </button>
                </div>

                {/* Tracking input */}
                <div className="relative mb-4">
                  <Search
                    size={16}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Enter tracking id"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="w-full bg-white rounded-full py-4 px-6 pl-11 text-[#0B1B3D] font-mono text-sm border-none shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] outline-none box-border"
                  />
                </div>

                {/* Submit */}
                <Link
                  to={`/tracking${trackingId ? "?id=" + trackingId : ""}`}
                  className="block w-full py-4 bg-[#e86b1c] text-white font-bold text-lg rounded-full text-center no-underline transition-all duration-300 shadow-[0_4px_20px_rgba(249,115,22,0.4)] box-border"
                >
                  Get tracking update
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
