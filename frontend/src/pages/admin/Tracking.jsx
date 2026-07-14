import TrackingPage from "../../components/tracking/TrackingPage";
import AddTracking from "../../components/tracking/AddTracking";
import { useTrackingStores } from "../../zustandStores/openModalStore";
import { useEffect } from "react";
function Tracking() {
    const { isAddTrackingOpen, closeAddTracking } = useTrackingStores();
    useEffect(() => {
        return () => {
            closeAddTracking();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <>{isAddTrackingOpen ? <AddTracking /> : <TrackingPage />}</>;
}
export default Tracking;
