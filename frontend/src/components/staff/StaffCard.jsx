import axios from "axios";
import { useDeactivateUser, useDeleteUser, } from "../../datahooks/user/userHook";
import { notifyError, notifySuccess } from "../../utils/toast";
import { Loader2 } from "lucide-react";
function StaffCard({ name, role, email, phone, status, userId, }) {
    const { deleteUserMutateAsync, deleteUserPending } = useDeleteUser();
    const { deactivateUserMutateAsync, deactivateUserPending } = useDeactivateUser();
    const handleDeleteStaff = async (id) => {
        try {
            await deleteUserMutateAsync(id);
            notifySuccess("Staff Deleted");
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                notifyError(err.response?.data?.message);
            }
            else {
                console.log(err);
            }
        }
    };
    // Deactivate Staff Function
    const handleDeactivateStaff = async (id) => {
        try {
            const toggleActive = status ? false : true;
            await deactivateUserMutateAsync({
                userId: id,
                data: {
                    isActive: toggleActive,
                },
            });
            notifySuccess(`User ${toggleActive ? "Activated" : "Deactivated"}`);
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                notifyError(err.response?.data?.message);
            }
            else {
                console.log(err);
            }
        }
    };
    return (<>
      <div className="bg-primary text-white  p-5 md:p-6 w-full rounded-lg shadow-sm">
        <div className="mb-3.5 flex justify-between gap-x-3.5">
          <div className="space-y-1">
            <p>{name}</p>
            <p className="text-xs bg-background text-textcol font-semibold py-0.5 px-2 rounded-full inline-block">
              {role}
            </p>
          </div>

          <div className={`w-2 h-2 rounded-[50%] mt-1.5 ${status ? "bg-[#00d4aa]" : "bg-red-700"} `}></div>
        </div>

        <div className="text-sm space-y-1 mb-4">
          <p>{email}</p>
          <p>{phone}</p>
        </div>

        <div className="flex justify-between items-center">
          <div onClick={() => handleDeactivateStaff(userId)} className="p-2 bg-red-500 text-sm rounded-lg cursor-pointer">
            {deactivateUserPending ? (<Loader2 className="animate-spin duration-300"/>) : status ? (<span>Deactivate</span>) : (<span>Activate</span>)}
          </div>
          <div onClick={() => handleDeleteStaff(userId)} className="p-2 bg-red-800 text-sm rounded-lg cursor-pointer">
            {deleteUserPending ? (<Loader2 className="animate-spin duration-300"/>) : (" Delete Staff")}
          </div>
        </div>
      </div>
    </>);
}
export default StaffCard;
