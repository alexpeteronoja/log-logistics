import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
function SidebarParent() {
    return (<>
      <Sidebar />

      <Outlet />
    </>);
}
export default SidebarParent;
