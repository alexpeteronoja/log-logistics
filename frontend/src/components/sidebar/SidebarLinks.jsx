// import { sideBarContent } from '../../utils/routeMaps';
import { NavLink } from "react-router-dom";
import { AdminSideBarContent, CoordinatorSideBarContent, OperatorSideBarContent, } from "../../utils/routeMaps";
import withAuth from "../../api/withAuth";
function LabelSidebarLinks({ setSideBarisOpen, }) {
    const { userRole } = withAuth();
    const navStyle = ({ isActive }) => ({
        backgroundColor: isActive ? "#EF770E" : "transparent",
        color: isActive ? "white" : "#ffffff",
        borderRadius: isActive ? "20px" : "0",
    });
    const sidebarContent = userRole === "admin"
        ? AdminSideBarContent
        : userRole === "coordinator"
            ? CoordinatorSideBarContent
            : userRole === "operator"
                ? OperatorSideBarContent
                : [];
    return (<>
      <div className="flex flex-col gap-y-1.5">
        {sidebarContent.map((item) => (<div>
            <NavLink onClick={() => setSideBarisOpen(false)} to={item.path} style={navStyle} className="flex gap-x-3 p-2 items-center">
              <div>
                <item.icon />
              </div>
              <div className="font-medium">{item.name}</div>
            </NavLink>
          </div>))}

        {/* {sideBarContent.map(item => (
          <SidebarSingleLink
            path={item.path}
            text={item.name}
            icon={item.icon}
            setSideBarisOpen={setSideBarisOpen}
          />
        ))} */}
      </div>
    </>);
}
export default LabelSidebarLinks;
