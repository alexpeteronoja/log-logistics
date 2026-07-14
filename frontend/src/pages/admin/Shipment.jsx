import { useEffect } from "react";
import CreateShipment from "../../components/shipment/CreateShipment";
import EditShipment from "../../components/shipment/EditShipment";
import ShipmentPage from "../../components/shipment/ShipmentPage";
import { useEditShipmentStore, useOpenAddShipmentStores, } from "../../zustandStores/openModalStore";
function Shipment() {
    //   const { showCreateShipment, setShowCreateShipment } = useState(false);
    const { isAddShipmentOpen, closeAddShipment } = useOpenAddShipmentStores();
    const { editShipmentStore, closeEditShipmentStore } = useEditShipmentStore();
    useEffect(() => {
        return () => {
            closeAddShipment();
            closeEditShipmentStore();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (<>
      {isAddShipmentOpen || editShipmentStore ? (<>
          {isAddShipmentOpen && <CreateShipment />}
          {editShipmentStore && <EditShipment />}
        </>) : (<ShipmentPage />)}
    </>);
}
export default Shipment;
