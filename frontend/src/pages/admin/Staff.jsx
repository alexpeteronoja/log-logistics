import StaffCard from "../../components/staff/StaffCard";
import CreateStaff from "../../components/staff/CreateStaff";
import { useOpenCreateStaffStore } from "../../zustandStores/openModalStore";
import { useGetAllUser } from "../../datahooks/user/userHook";
import { StaffGridSkeleton } from "../../components/skeleton/StaffGridSkeleton";
import { useEffect } from "react";
function Staff() {
    const { isCreateStaffStoreOpen, openCreateStaffStore, closeCreateStaffStore, } = useOpenCreateStaffStore();
    const { getAllUser, getAllUserLoading } = useGetAllUser();
    useEffect(() => {
        return () => {
            closeCreateStaffStore();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (<>
      {!isCreateStaffStoreOpen ? (<div className="pt-24 pb-10 ml-0 lg:ml-71 px-4 md:px-8.5 bg-background text-textcol min-h-dvh">
          <div className="flex justify-between items-center pt-5 pb-3 flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-extrabold mb-1">Staff</h1>
            </div>

            <div onClick={openCreateStaffStore} className="py-2.5 px-5 bg-accent rounded-md text-white cursor-pointer">
              Add Staff +
            </div>
          </div>

          {/* Staff Card */}
          {getAllUserLoading ? (<StaffGridSkeleton />) : (<div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {getAllUser.map((item) => (<StaffCard userId={item._id} email={item.email} name={item.name} phone={item.phoneNumber} role={item.role} status={item.isActive}/>))}
            </div>)}
        </div>) : (<CreateStaff />)}
    </>);
}
export default Staff;
