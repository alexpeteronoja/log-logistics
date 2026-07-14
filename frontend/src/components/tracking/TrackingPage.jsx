import { useState } from "react";
import TrackingTable from "./TrackingTable";
import { useGetAllShipment } from "../../datahooks/shipment/shipmentHook";
import TableSkeleton from "../skeleton/TableSkeleton";
function TrackingPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const { getAllShipment, getAllShipmentLoading } = useGetAllShipment();
    const filteredShipments = getAllShipment;
    // const filteredShipments = ShipmentData.filter(
    //   (shipment) =>
    //     shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     shipment.receiver.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     shipment.destination.toLowerCase().includes(searchQuery.toLowerCase()),
    // );
    return (<>
      <div className="mt-18 pb-10 ml-0 lg:ml-71 px-4 md:px-8.5 bg-background text-textcol min-h-dvh">
        <div className="flex justify-between items-center pt-5 pb-3 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-extrabold mb-1">Tracking</h1>
          </div>
        </div>

        <div className="mb-4 text-2xl">
          <p style={{ color: "var(--txt-secondary)", fontSize: "14px" }}>
            {/* {pagination ? `${pagination.total} total shipments` : "Loading…"} */}
            total tracking
          </p>
        </div>

        {/* Shipment Table */}

        <div className="bg-white p-6 rounded-md">
          <div className="w-full flex items-center justify-between">
            <h3 className="text-lg font-semibold font-nunito">
              Recent Tracking
            </h3>

            <div className="w-72">
              <input type="text" placeholder="Enter Tracking ID" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-9  border  focus:border-primary w-full px-4 outline rounded-2xl "/>
            </div>
          </div>

          {getAllShipmentLoading ? (<TableSkeleton />) : (<TrackingTable filteredShipments={filteredShipments}/>)}
        </div>
      </div>
    </>);
}
export default TrackingPage;
