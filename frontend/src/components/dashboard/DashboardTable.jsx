import { Eye, FilePenLine, Search, Trash2 } from "lucide-react";
function DashboardTable({ filteredShipments }) {
    return (<>
      <div>
        {/* Table Content */}

        <div className="overflow-x-auto w-full mt-5">
          <table className="w-full dash-table min-w-max">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 text-base text-muted-foreground">
                  Tracking ID
                </th>
                <th className="pb-3 text-base text-muted-foreground">
                  Receiver
                </th>
                <th className="pb-3 text-base text-muted-foreground">
                  Destination
                </th>
                <th className="pb-3 text-base text-muted-foreground">Status</th>
                <th className="pb-3 text-base text-muted-foreground">Date</th>
                <th className="pb-3 text-base text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.length > 0 ? (filteredShipments.map((shipment, index) => (<tr key={shipment.id} className={`border-b border-border last:border-0 ${index % 2 === 0 ? "bg-white" : ""}`}>
                    <td className="py-4">
                      <span className="font-mono text-base">{shipment.id}</span>
                    </td>
                    <td className="py-4 text-base">{shipment.receiver}</td>
                    <td className="py-4 text-base text-muted-foreground">
                      {shipment.destination}
                    </td>
                    <td className="py-4">{shipment.status}</td>
                    <td className="py-4 text-base text-muted-foreground">
                      {shipment.date}
                    </td>
                    <td className="py-4">
                      <div>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-[#f4faf0] transition-colors cursor-pointer hover:scale-110 duration-300" title="View Product">
                          <Eye />
                        </button>

                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-[#f4faf0] transition-colors cursor-pointer hover:scale-110 duration-300" title="Edit product">
                          <FilePenLine />
                        </button>

                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-[#f4faf0] transition-colors cursor-pointer hover:scale-110 duration-300" title="Edit product">
                          <Trash2 />
                        </button>
                      </div>
                    </td>
                  </tr>))) : (<tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50"/>
                    No shipments found
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </>);
}
export default DashboardTable;
