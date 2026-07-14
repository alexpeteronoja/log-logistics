import { useState } from "react";
import SidebarLinks from "./SidebarLinks";
import { Link } from "react-router-dom";
import AdminNavbar from "../navbar/AdminNavbar";
import { LogOut, Package, Settings, User, X } from "lucide-react";
import { useLogOut } from "../../datahooks/authentication/authenticationHook";
function Sidebar() {
    const { logoutMutate } = useLogOut();
    const [sideBarisOpen, setSideBarisOpen] = useState(false);
    return (<>
      <AdminNavbar toggleSideBar={() => setSideBarisOpen(!sideBarisOpen)}/>

      {sideBarisOpen && (<div onClick={() => setSideBarisOpen(false)} className="fixed inset-0 bg-black opacity-50 z-45 lg:hidden"></div>)}

      <div className={`fixed top-0 left-0 px-6 pb-12 w-72.5 h-screen flex flex-col justify-between gap-y-30 overflow-y-auto no-scrollbar z-50 transform transition-transform ease-in-out duration-300 ${sideBarisOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 bg-primary text-white`}>
        <div className="relative">
          <div className="py-8">
            <div className="flex items-center gap-2 w-full max-w-34">
              <span className="bg-[#0c5aa6] text-white p-2 rounded-lg">
                <Package className="w-8 h-8 text-white font-bold"/>
              </span>
              <span className="text-xl font-bold">
                <Link to="/">FastLink</Link>
              </span>
            </div>
          </div>

          <div onClick={() => setSideBarisOpen(!sideBarisOpen)} className="lg:hidden text-white cursor-pointer absolute top-2 right-0">
            <X />
          </div>

          <SidebarLinks setSideBarisOpen={setSideBarisOpen}/>
        </div>

        {/* Second Section */}

        <div>
          <Link to="/profile">
            <div className="flex gap-x-3 p-2 items-center text-white">
              <div>
                <User />
              </div>
              <div className="font-medium">Profile</div>
            </div>
          </Link>

          <Link to="/settings">
            <div className="flex gap-x-3 p-2 items-center text-white">
              <div>
                <Settings />
              </div>
              <div className="font-medium">Settings</div>
            </div>
          </Link>

          <div className="flex gap-x-3 p-2 items-center text-[#FF3B30] cursor-pointer">
            <div>
              <LogOut />
            </div>

            <div onClick={() => logoutMutate()} className="font-medium">
              Logout
            </div>
          </div>
        </div>
      </div>
    </>);
}
export default Sidebar;
