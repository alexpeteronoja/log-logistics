import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useGetShipment } from "../../datahooks/shipment/shipmentHook";
import { Loader2 } from "lucide-react";
import { formatDateTime } from "../../utils/dateformat";

function CustomerReceipt() {
    const { shipmentId } = useParams();
    const { getShipment: shipment, getShipmentLoading } = useGetShipment(shipmentId ?? "");
    const receiptRef = useRef(null);
    
    const handlePrint = useReactToPrint({
        contentRef: receiptRef,
        documentTitle: "Receipt",
    });

    if (getShipmentLoading) {
        return (
            <div className="w-[80mm] bg-white p-2 text-black font-mono text-xs">
                <Loader2 className="animate-spin duration-300 mx-auto mt-3" />
            </div>
        );
    }

    return (
        <>
            <div className="w-[80mm] flex justify-center">
                <button 
                    onClick={handlePrint} 
                    className="mb-4 mt-2 rounded cursor-pointer bg-accent hover:bg-accent/85 px-4 py-2 text-white print:hidden"
                >
                    Print Receipt
                </button>
            </div>

            <div ref={receiptRef} className="w-[80mm] bg-white p-2 text-black font-mono text-xs">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-lg font-bold">FastLink</h2>
                    <p>123 Delivery St. New York</p>
                    <p>+447448338490</p>
                </div>

                <div className="my-2 border-t border-dashed border-black" />

                {/* Date */}
                <div className="flex justify-between py-1">
                    <span>Date:</span>
                    <span>{formatDateTime(shipment?.createdAt)}</span>
                </div>

                <div className="flex justify-between py-1">
                    <span>Tracking No:</span>
                    <span>{shipment?.trackingCode}</span>
                </div>

                <div className="my-2 border-t border-dashed border-black" />

                {/* Sender Details */}
                <div>
                    <p className="font-bold">Sender:</p>
                    <p>{shipment?.senderName || "N/A"}</p>
                    <p>{shipment?.senderPhoneNo || "N/A"}</p>
                </div>

                <div className="my-2 border-t border-dashed border-black" />

                {/* Receiver Details */}
                <div>
                    <p className="font-bold">Receiver:</p>
                    <p>{shipment?.recipientName || "N/A"}</p>
                    <p>{shipment?.recipientPhoneNo || "N/A"}</p>
                </div>

                <div className="my-2 border-t border-dashed border-black" />

                {/* Shipment Details */}
                <div className="flex gap-x-1.5 py-1">
                    <span>From:</span>
                    <span>{shipment?.senderAddress || "N/A"}</span>
                </div>

                <div className="flex gap-x-1.5 py-1">
                    <span>To:</span>
                    <span>{shipment?.recipientAddress || "N/A"}</span>
                </div>

                <div className="flex gap-x-1.5 py-1">
                    <span>Weight:</span>
                    <span>{shipment?.weight || "N/A"}</span>
                </div>

                <div className="my-2 border-t border-dashed border-black" />

                {/* Footer */}
                <div className="mt-3 text-center text-[11px]">
                    <p>Thank you for choosing us.</p>
                    <p>Please keep this receipt.</p>
                </div>
            </div>
        </>
    );
}

export default CustomerReceipt;
