import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LandingNavbar from "../../components/navbar/LandingNavbar";
import { Check, Loader2, MapPin, Package, Search, Truck } from "lucide-react";
import Footer from "../../components/Footer";
import { usePublicTracking } from "../../datahooks/shipment/shipmentHook";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { notifyError } from "../../utils/toast";
import { formatDate, formatDateTime } from "../../utils/dateformat";
import axios from "axios";
/** status styles */
function statusStyle(status) {
  if (status === "Delivered")
    return "text-[#16a34a] bg-green-50 border-green-200";
  if (status === "In Transit")
    return "text-accent bg-orange-50 border-orange-200";
  return "text-[#20186d] bg-indigo-50 border-indigo-200";
}
export default function TrackParcel() {
  const navigate = useNavigate();
  const { trackingId = "" } = useParams();
  const [query, setQuery] = useState("");
  //   const trackingId = "TRK-20260606-B2AFD885";
  const { publicTracking, publicTrackingLoading, publicTrackingErrorMessage } =
    usePublicTracking(trackingId);
  // Handle Tracking Function
  const handleTrack = () => {
    if (!query.trim()) return;
    const trackingId = query.trim().toLocaleUpperCase();
    if (!trackingId.startsWith("SWX")) {
      notifyError("Invalid Tracking Code");
      return;
    }
    navigate(`/track-parcel/${trackingId}`);
  };
  // Update Search Form on Tracking ID Change
  useEffect(() => {
    if (trackingId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery(trackingId);
    }
  }, [trackingId]);
  // Get Error Message Once
  useEffect(() => {
    if (publicTrackingErrorMessage) {
      getErrorMessage(publicTrackingErrorMessage);
    }
  }, [publicTrackingErrorMessage]);

  return (
    <>
      <LandingNavbar />

      <div className="min-h-screen  font-['DM_Sans',sans-serif]">
        <section className="relative w-full h-100 flex items-center justify-center bg-[url('/tracking-hero.png')] bg-cover bg-center">
          {/* Overlay */}
          <div className="absolute inset-0 bg-[rgba(11,27,61,0.4)]" />

          {/* Title */}
          <h1 className="relative z-10 text-white text-[clamp(2.5rem,6vw,4.5rem)] font-black tracking-[-0.02em] m-0 [text-shadow:0_4px_12px_rgba(0,0,0,0.3)]">
            Track Shipment
          </h1>
        </section>

        {/* HEADER */}
        <section className="max-w-7xl mx-auto px-6 pt-20 box-border">
          <div className="max-w-200 mx-auto">
            {/* Header Text */}
            <div className="mb-10">
              <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-black text-[#0B1B3D] mb-3 tracking-[-0.02em] m-0">
                Track your package
              </h2>
              <p className="text-base text-slate-500 leading-[1.6] m-0">
                Enter your tracking number to see real time updates of where
                your package is.
              </p>
            </div>

            {/* Search Box */}
            <div className="flex flex-wrap gap-3 mb-12">
              <div className="relative flex-[1_1_300px]">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  placeholder="Tracking number (e.g. SLX-2026-4829173)"
                  className="w-full py-5 px-5 pl-13 bg-white rounded-2xl border border-slate-300 text-[#0B1B3D] text-base outline-none shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-[border-color,box-shadow] duration-300 box-border focus:border-[#FF6B35] focus:shadow-[0_0_0_4px_rgba(249,115,22,0.15)]"
                />
              </div>
              <button
                onClick={handleTrack}
                disabled={publicTrackingLoading || !query.trim()}
                className="px-10 py-5 bg-[#FF6B35] text-white font-bold text-base rounded-2xl border-none cursor-pointer whitespace-nowrap transition-all duration-300 shadow-[0_4px_6px_-1px_rgba(249,115,22,0.2)] hover:-translate-y-0.5 hover:bg-[#ea580c] hover:shadow-[0_10px_15px_-3px_rgba(249,115,22,0.3)]"
              >
                {publicTrackingLoading ? (
                  <Loader2 className="animate-spin duration-300" />
                ) : (
                  "Track Now"
                )}
              </button>
            </div>
          </div>
        </section>

        {/* BODY */}
        <section className="px-[5%] py-16 max-w-4xl mx-auto bg-background md:rounded-2xl">
          {publicTrackingLoading ? (
            <div className="text-center py-20">
              <div className="w-11 h-11 mx-auto mb-5 rounded-full border-4 border-[#e2e6ef] border-t-accent animate-spin" />
              <p className="text-gray-500">Searching for your shipment…</p>
            </div>
          ) : axios.isAxiosError(publicTrackingErrorMessage) &&
            publicTrackingErrorMessage?.response?.status === 400 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-5">📦</div>
              <h3 className="text-xl font-bold text-primary mb-2 font-['Syne',sans-serif]">
                No shipment found
              </h3>
              <p className="text-gray-500">
                We couldn't find that tracking ID.
              </p>
            </div>
          ) : publicTracking ? (
            <div className="flex flex-col gap-5 animate-[fadeUp_0.5s_ease] font-nunito">
              {/* STATUS CARD */}
              <div className="bg-white rounded-xl p-7 flex flex-col md:flex-row justify-between items-center gap-y-5 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="w-13 h-13 rounded-xl flex  items-center justify-center bg-accent/10">
                    <Package className="w-6.5 h-6.5 text-accent" />
                  </div>

                  <div>
                    <p className="text-xl font-extrabold text-primary font-nunito">
                      {publicTracking?.trackingCode}
                    </p>
                    <p className="text-sm text-gray-500 text-center md:text-start mt-1 md:mt-0">
                      {publicTracking?.category} ·{" "}
                      {`${publicTracking?.weight}kg`}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-5 py-2 rounded-full border text-sm font-bold font-['Syne',sans-serif] ${statusStyle(publicTracking?.status)}`}
                >
                  {publicTracking?.status}
                </span>
              </div>

              {/* PROGRESS */}
              <div className="bg-white rounded-xl p-7 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between text-xs text-gray-500 mb-2">
                  <span>{publicTracking?.senderAddress}</span>
                  <span>{publicTracking?.recipientAddress}</span>
                </div>

                {/* <div className="h-2.5 bg-[#e2e6ef] rounded-full overflow-hidden">
              <div
                className="h-full bg-[linear-gradient(90deg,#20186d,#ef770e)] transition-all duration-1000"
                style={{ width: `${tracked.progress}%` }}
              />
            </div> */}

                <div className="flex justify-between gap-4 mt-2 text-sm">
                  <span>
                    ETA:{" "}
                    <strong>
                      {formatDate(publicTracking?.estimatedDelivery)}
                    </strong>
                  </span>
                  {/* <span className="text-accent font-bold">
              {tracked.progress}% Complete
            </span> */}
                </div>
              </div>

              {/* DETAILS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Sender", value: publicTracking?.senderName },
                  { label: "Recipient", value: publicTracking?.recipientName },
                  { label: "Origin", value: publicTracking?.senderAddress },
                  {
                    label: "Destination",
                    value: publicTracking?.recipientAddress,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white rounded-xl px-6 py-5 shadow-sm"
                  >
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">
                      {item.label}
                    </p>

                    <p className="text-[15px] font-bold text-textcol">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* TIMELINE */}
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-7 text-primary font-['Syne',sans-serif]">
                  Shipment Timeline
                </h3>

                <div className="flex flex-col">
                  {publicTracking.events.map((item, i) => (
                    <div key={i} className="relative flex gap-5 pb-7 last:pb-0">
                      {/* Vertical line */}
                      {i < publicTracking.events.length - 1 && (
                        <div
                          className={`absolute left-5 top-10 bottom-0 w-0.5 ${item.done ? "bg-accent/40" : "bg-gray-200"}`}
                        />
                      )}

                      {/* Dot */}
                      <div
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                          i === 0 || item.status === "delivered"
                            ? "bg-accent"
                            : "bg-accent/20 border-2 border-accent/60"
                        }`}
                      >
                        <Check
                          className={`w-3.5 h-3.5 ${i === 0 || item.status === "delivered" ? "text-white" : "text-accent"}`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <div className="flex flex-col md:flex-row justify-between gap-2 flex-wrap mb-1">
                          <p
                            className={`font-bold text-[15px] font-['Syne',sans-serif] 
                              text-textcol
                            `}
                          >
                            {item.status}
                          </p>

                          <p className="text-xs text-gray-400">
                            {formatDateTime(item.timestamp)}
                          </p>
                        </div>

                        <p className="text-[13px] text-gray-500">
                          {item.description}
                        </p>

                        <p className="text-sm text-gray-500 mt-1 flex gap-x-1">
                          <MapPin className="w-4 h-4" />
                          {item.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-primary/10">
                <Truck className="w-11 h-11 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary font-['Syne',sans-serif] mb-2">
                Enter a Tracking ID Above
              </h3>
              <p className="text-gray-500">
                Your shipment details will appear here.
              </p>
            </div>
          )}
        </section>
      </div>

      <div className="mt-10">
        <Footer />
      </div>
    </>
  );
}
