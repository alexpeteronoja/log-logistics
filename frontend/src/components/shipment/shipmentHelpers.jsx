export const Info = ({ label, value, icon: Icon, }) => {
    return (<div>
      <div className="flex items-center">
        <div>{Icon && <Icon className="w-4 h-4 me-3"/>}</div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
      <p className="text-base mt-1">{value}</p>
    </div>);
};
export const PersonCard = ({ title, icon: Icon, name, address, city, state, country, phone, email, zip, showContact, }) => {
    return (<div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5"/>
        <h2 className="font-semibold">{title}</h2>
      </div>

      <div className="space-y-1 text-sm">
        <p className="font-medium">{name}</p>
        <p className="text-gray-500">{address}</p>
        <p className="text-gray-500">
          {city}, {state} {zip}
        </p>
        <p className="text-gray-500">{country}</p>

        {showContact && (<div className="pt-3 mt-3 border-t text-gray-500">
            <p>{phone}</p>
            <p>{email}</p>
          </div>)}
      </div>
    </div>);
};
// Timeline
import { Package, MapPin, Truck, CheckCircle, AlertCircle } from "lucide-react";
import { formatDateTime } from "../../utils/dateformat";
const statusIcons = {
    pending: Package,
    in_transit: Truck,
    out_for_delivery: MapPin,
    delivered: CheckCircle,
    exception: AlertCircle,
};
const statusColors = {
    pending: "text-muted-foreground bg-muted",
    in_transit: "text-blue-600 bg-blue-100",
    out_for_delivery: "text-orange-600 bg-orange-100",
    delivered: "text-green-600 bg-green-100",
    exception: "text-red-600 bg-red-100",
};
export function Timeline({ events }) {
    return (<div className="space-y-6">
      {events?.map((event, index) => {
            const Icon = statusIcons[event.normalizedStatus || event.status] || Package;
            const isLast = index === events.length - 1;
            return (<div key={event._id || index} className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${statusColors[event.normalizedStatus || event.status] || statusColors.pending}`}>
                <Icon className="w-5 h-5"/>
              </div>
              {!isLast && (<div className="w-0.5 h-full min-h-12 bg-background mt-2"/>)}
            </div>

            <div className="flex-1 pb-6">
              <p className="text-sm text-muted-foreground">
                {formatDateTime(event.timestamp)}
              </p>
              <p className="mt-1">{event.description}</p>
              <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-4 h-4"/>
                {event.location || "System"}
              </p>
            </div>
          </div>);
        })}
    </div>);
}
