import { Link } from "react-router-dom";
import { BellIcon, Dot, Menu, Package, SearchIcon, LogOut } from "lucide-react";
import { AvatarImg } from "../../assets";
import { shortenText } from "../../utils/shortenText";
import { useGetMe } from "../../datahooks/user/userHook";
import { useEffect, useRef, useState } from "react";
import { useLogOut } from "../../datahooks/authentication/authenticationHook";
function AdminNavbar({ toggleSideBar }) {
    const { getMe } = useGetMe();
    const [openMenu, setOpenMenu] = useState(false);
    const { logoutMutate } = useLogOut();
    const dropdownRef = useRef(null);
    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                setOpenMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (<>
      <nav className="z-40 fixed top-0 left-0 lg:left-71 right-0 bg-primary">
        <div className="h-18 mx-5 sm:mx-8 flex items-center justify-between text-white">
          <button type="button" onClick={toggleSideBar} className="lg:hidden cursor-pointer">
            <Menu />
          </button>

          {/* Search Bar */}
          <div className="hidden lg:block font-medium relative">
            <div>
              <input type="text" className="rounded-full py-4 ps-12 pe-4 h-12 w-100 border border-white outline-0" placeholder="Search"/>
            </div>

            <div className="absolute top-3.5 left-4">
              <SearchIcon />
            </div>
          </div>

          {/* Logo Only in Mobile */}
          <div className="lg:hidden">
            <div className="flex items-center gap-2 w-full max-w-34">
              <span className="bg-[#0c5aa6] text-white p-2 rounded-lg">
                <Package className="w-8 h-8 text-primary font-bold"/>
              </span>

              <span className="text-xl font-bold">
                <Link to="/">FastLink</Link>
              </span>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex gap-x-4 items-center">
            <div className="hidden md:block">
              <BellIcon />
            </div>

            {/* Avatar Section */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setOpenMenu(!openMenu)} className="flex gap-x-1.5 items-center cursor-pointer">
                <div>
                  <img src={AvatarImg} alt="" className="h-11 w-11 rounded-full object-cover"/>
                </div>

                <div className="text-left">
                  <p>{shortenText(getMe?.name, 6)}</p>

                  <div className="flex gap-1 items-center mt-1">
                    <Dot className="w-2 h-2 rounded-full"/>

                    <p className="text-xs">Online</p>
                  </div>
                </div>
              </button>

              {/* Dropdown */}
              {openMenu && (<div className="absolute right-0 top-15 cursor-pointer w-48 rounded-xl bg-white shadow-lg border border-gray-200 overflow-hidden z-50">
                  <button onClick={() => logoutMutate()} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-gray-100 transition">
                    <LogOut className="w-4 h-4"/>
                    Logout
                  </button>
                </div>)}
            </div>
          </div>
        </div>
      </nav>
    </>);
}
export default AdminNavbar;
