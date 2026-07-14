import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/landingPage/Home";
import Login from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import ScrollToTop from "./ScrollToTop";
import Dashboard from "./pages/admin/Dashboard";
import SidebarParent from "./pages/SidebarParent";
import Shipment from "./pages/admin/Shipment";
import Tracking from "./pages/admin/Tracking";
import ShipmentDetails from "./pages/admin/ShipmentDetails";
import Staff from "./pages/admin/Staff";
import Profile from "./pages/admin/Profile";
import Settings from "./pages/admin/Settings";
import TrackParcel from "./pages/landingPage/TrackParcel";
import ProtectRoutes from "./pages/ProtectRoutes";
import AboutPage from "./pages/landingPage/AboutPage";
import Contact from "./pages/landingPage/Contact";
import CustomerReceipt from "./components/Printing/CustomerReceipt";
function App() {
    return (<>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/admin" element={<Login />}/>
          <Route path="/about" element={<AboutPage />}/>
          <Route path="/contact" element={<Contact />}/>

          <Route path="/track-parcel/" element={<TrackParcel />}/>
          <Route path="/track-parcel/:trackingId" element={<TrackParcel />}/>

          <Route path="/customer-receipt/:shipmentId" element={<CustomerReceipt />}/>

          {/* Admin Routes */}

          <Route path="/" element={<SidebarParent />}>
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/shipment" element={<ProtectRoutes requiredRole={["admin", "coordinator"]}>
                  <Shipment />
                </ProtectRoutes>}/>
            <Route path="/shipment-details/:shipmentId" element={<ProtectRoutes requiredRole={["admin", "coordinator", "operator"]}>
                  <ShipmentDetails />
                </ProtectRoutes>}/>

            <Route path="/tracking" element={<ProtectRoutes requiredRole={["admin", "coordinator", "operator"]}>
                  <Tracking />{" "}
                </ProtectRoutes>}/>

            <Route path="/staff" element={<ProtectRoutes requiredRole={["admin"]}>
                  <Staff />
                </ProtectRoutes>}/>

            <Route path="/profile" element={<ProtectRoutes requiredRole={["admin", "coordinator", "operator"]}>
                  <Profile />
                </ProtectRoutes>}/>

            <Route path="/settings" element={<ProtectRoutes requiredRole={["admin", "coordinator", "operator"]}>
                  <Settings />
                </ProtectRoutes>}/>
          </Route>
        </Routes>
      </Router>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover limit={2} theme="light"/>
    </>);
}
export default App;
