function TableSkeleton() {
    return (<div className="overflow-x-auto w-full mt-5 animate-pulse">
      <table className="w-full dash-table min-w-max">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-3 text-base text-muted-foreground">
              Tracking ID
            </th>
            <th className="pb-3 text-base text-muted-foreground">Receiver</th>
            <th className="pb-3 text-base text-muted-foreground">
              Destination
            </th>
            <th className="pb-3 text-base text-muted-foreground">Status</th>
            <th className="pb-3 text-base text-muted-foreground">Date</th>
            <th className="pb-3 text-base text-muted-foreground">Actions</th>
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: 6 }).map((_, index) => (<tr key={index} className={`border-b border-border last:border-0 ${index % 2 === 0 ? "bg-white" : ""}`}>
              {/* Tracking ID */}
              <td className="py-4">
                <div className="h-4 w-36 rounded bg-gray-200"/>
              </td>

              {/* Receiver */}
              <td className="py-4">
                <div className="h-4 w-28 rounded bg-gray-200"/>
              </td>

              {/* Destination */}
              <td className="py-4">
                <div className="h-4 w-24 rounded bg-gray-200"/>
              </td>

              {/* Status */}
              <td className="py-4">
                <div className="h-7 w-24 rounded-full bg-gray-200"/>
              </td>

              {/* Date */}
              <td className="py-4">
                <div className="h-4 w-20 rounded bg-gray-200"/>
              </td>

              {/* Actions */}
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-200"/>
                  <div className="w-9 h-9 rounded-lg bg-gray-200"/>
                  <div className="w-9 h-9 rounded-lg bg-gray-200"/>
                </div>
              </td>
            </tr>))}
        </tbody>
      </table>
    </div>);
}
export default TableSkeleton;
