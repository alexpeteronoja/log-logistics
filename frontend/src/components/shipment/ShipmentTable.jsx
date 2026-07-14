import { Eye, FilePenLine, Loader2, Printer, Search, Trash2 } from "lucide-react";
import { useDeleteShipment } from "../../datahooks/shipment/shipmentHook";
import { notifyError, notifySuccess } from "../../utils/toast";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { shortenText } from "../../utils/shortenText";
import { useEditShipmentStore } from "../../zustandStores/openModalStore";
import { formatDate } from "../../utils/dateformat";

function ShipmentTable({ filteredShipments }) {
    const [deleteShipmentId, setDeleteShipmentId] = useState(null);
    const { deleteShipmentMutateAsync, deleteShipmentPending } = useDeleteShipment();
    const { setEditShipmentStore } = useEditShipmentStore();
    const navigate = useNavigate();

    const handleDeleteShipment = async (shipmentId) => {
        try {
            setDeleteShipmentId(shipmentId);
            await deleteShipmentMutateAsync(shipmentId);
            notifySuccess("Shipment Deleted");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.log("my error", err.response);
                notifyError(err.response?.data?.message);
            } else {
                console.log(err);
            }
        }
    };

    const handlePrintReceipt = (shipmentId) => {
        window.open(`/customer-receipt/${shipmentId}`, "_blank", `
            width=400,
            height=700,
            left=200,
            top=100,
            resizable=yes,
            scrollbars=yes
        `);
    };

    return (
        <>
            <div>
                {/* Table Content */}
                <div className="overflow-x-auto w-full mt-5">
                    <table className="w-full dash-table min-w-max">
                        <thead>
                            <tr className="border-b border-border text-left">
                                <th className="pb-3 text-base text-muted-foreground">Tracking ID</th>
                                <th className="pb-3 text-base text-muted-foreground">Receiver</th>
                                <th className="pb-3 text-base text-muted-foreground">Destination</th>
                                <th className="pb-3 text-base text-muted-foreground">Status</th>
                                <th className="pb-3 text-base text-muted-foreground">Date</th>
                                <th className="pb-3 text-base text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredShipments?.length > 0 ? (
                                filteredShipments?.map((shipment, index) => (
                                    <tr key={shipment._id} className={`border-b border-border last:border-0 ${index % 2 === 0 ? "bg-white" : ""}`}>
                                        <td className="py-4">
                                            <span className="text-base font-mono">{shipment.trackingCode}</span>
                                        </td>
                                        <td className="py-4 text-base">
                                            {shortenText(shipment.recipientName || "N/A", 16)}
                                        </td>
                                        <td className="py-4 text-base text-muted-foreground">
                                            {shortenText(shipment.recipientAddress || "N/A", 10)}
                                        </td>
                                        <td className="py-4">{shipment.status || "N/A"}</td>
                                        <td className="py-4 text-base text-muted-foreground">
                                            {formatDate(shipment.createdAt)}
                                        </td>
                                        <td className="py-4">
                                            <div>
                                                <button className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-[#f4faf0] transition-colors cursor-pointer hover:scale-110 duration-300" onClick={() => navigate(`/shipment-details/${shipment.trackingCode}`)} title="View Product">
                                                    <Eye />
                                                </button>

                                                <button className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-[#f4faf0] transition-colors cursor-pointer hover:scale-110 duration-300" onClick={() => setEditShipmentStore(shipment)} title="Edit product">
                                                    <FilePenLine />
                                                </button>

                                                <button className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-[#f4faf0] transition-colors cursor-pointer hover:scale-110 duration-300" title="Print Product" onClick={() => handlePrintReceipt(shipment.trackingCode)}>
                                                    <Printer />
                                                </button>

                                                <button onClick={() => handleDeleteShipment(shipment.trackingCode)} className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-[#f4faf0] transition-colors cursor-pointer hover:scale-110 duration-300" title="Delete Product">
                                                    {deleteShipmentPending && deleteShipmentId === shipment.trackingCode ? (
                                                        <Loader2 className="animate-spin duration-300 mx-auto" />
                                                    ) : (
                                                        <Trash2 />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        No shipments found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default ShipmentTable;
