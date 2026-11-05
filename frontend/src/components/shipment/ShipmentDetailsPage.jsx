import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Truck,
  Calendar,
  Clock,
} from "lucide-react";
import { Timeline, Info, PersonCard } from "./shipmentHelpers";
import {
  useGetShipment,
  useManualPoll,
} from "../../datahooks/shipment/shipmentHook";
import { formatDateTime } from "../../utils/dateformat";
import ShipmentDetailsSkeleton from "../skeleton/ShipmentDetailsSkeleton";

export default function ShipmentDetailsPage() {
  const { shipmentId } = useParams();
  const navigate = useNavigate();
  const { getShipment: shipment, getShipmentLoading } = useGetShipment(shipmentId ?? "");
  const { manualPollMutateAsync, manualPollPending } = useManualPoll();

  const handleSync = async () => {
    if (!shipmentId) return;
    await manualPollMutateAsync(shipmentId);
  };

  if (getShipmentLoading) {
    return <ShipmentDetailsSkeleton />;
  }

  if (!shipment) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="text-center max-w-md">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Shipment not found</h2>
          <p className="text-gray-500 mb-6">
            We couldn’t find a shipment with that tracking code.
          </p>
          <button
            onClick={() => navigate("/track")}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Go to Tracking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-10 ml-0 lg:ml-71 px-4 md:px-8.5 bg-background text-textcol min-h-dvh">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm cursor-pointer text-gray-600 hover:text-black mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-3xl mb-2">Shipment Details</h1>
              <p className="text-sm text-gray-500 font-mono">
                {shipment.trackingCode}
              </p>
            </div>

            {/* Status & Sync */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 w-fit">
                {shipment.status}
              </div>

              {shipment.carrier && shipment.carrier !== "swiftex" && (
                <button
                  onClick={handleSync}
                  disabled={manualPollPending}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                >
                  {manualPollPending ? "Syncing..." : "Sync from Carrier"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5" />
              <h2 className="font-semibold">Shipment Overview</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <Info label="Ship Date" value="20/20/20" icon={Calendar} />
              <Info
                label="Estimated Delivery"
                value={formatDateTime(shipment.estimatedDelivery)}
                icon={Calendar}
              />
              <Info
                label="Service / Carrier"
                value={
                  shipment.carrier === "swiftex"
                    ? "SwiftEx"
                    : shipment.carrier?.toUpperCase()
                }
                icon={Package}
              />
              <Info
                label="Current Location"
                value="Boston Distribution Center"
                icon={MapPin}
              />
              <Info label="Weight" value={`${shipment.weight || 0} kg`} />
              <Info label="Dimensions" value="12 x 8 x 4 inches" />
              {shipment.carrier !== "swiftex" &&
                shipment.status !== "DELIVERED" &&
                shipment.lastFetchedAt && (
                  <Info
                    label="Last Updated"
                    value={formatDateTime(shipment.lastFetchedAt)}
                    icon={Clock}
                  />
                )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="font-semibold mb-4">Tracking Timeline</h2>

            <Timeline events={shipment.events} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* Sender */}
          <PersonCard
            title="Sender"
            icon={User}
            name={shipment.senderName}
            address={shipment.senderAddress}
            city="Abuja"
            state="FCT"
            country="Nigeria"
            zip="10001"
          />

          {/* Receiver */}
          <PersonCard
            title="Receiver"
            icon={MapPin}
            name={shipment.recipientName}
            address={shipment.recipientAddress}
            city="Abuja"
            state="FCT"
            country="Nigeria"
            zip="10001"
            phone={shipment.recipientPhoneNo}
            email={shipment.recipientEmail}
            showContact
          />
        </div>
      </div>
    </div>
  );
}
