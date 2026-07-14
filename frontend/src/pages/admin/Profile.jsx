import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useGetMe, useUpdateMe } from "../../datahooks/user/userHook";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { notifySuccess } from "../../utils/toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
function Profile() {
    const { getMe, getMeLoading } = useGetMe();
    const { updateMeMutateAsync } = useUpdateMe();
    const { register, handleSubmit, formState: { isSubmitting, dirtyFields }, reset, } = useForm();
    const onSubmit = async (data) => {
        try {
            const updatedData = Object.keys(dirtyFields).reduce((acc, key) => {
                acc[key] = data[key];
                return acc;
            }, {});
            await updateMeMutateAsync(updatedData);
            notifySuccess("Profile Updated");
            // console.log("FORM DATA:", data);
            // Example API call
            // await client.post("/shipments", data);
            reset();
        }
        catch (err) {
            getErrorMessage(err);
        }
    };
    useEffect(() => {
        reset({
            name: getMe?.name,
            email: getMe?.email,
            phoneNumber: getMe?.phoneNumber,
        });
    }, [reset, getMe]);
    return (<>
      <div className="pt-24 pb-10 ml-0 lg:ml-71 px-4 md:px-8.5 bg-background text-textcol min-h-dvh">
        <div className="bg-white w-full p-6 relative rounded-md">
          <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>

          {/* Form Details */}
          {getMeLoading ? (<div className="space-y-8">
              <Skeleton height={20} width={180} className="mb-4"/>

              <Skeleton height={40} className="mb-3"/>
              <Skeleton height={40} className="mb-3"/>
              <Skeleton height={40}/>
            </div>) : (<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* ================= SENDER ================= */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Personal Information
                </h3>

                <input {...register("name", { required: true })} placeholder="Full Name" className="input"/>

                <input {...register("phoneNumber")} placeholder="Phone Number" className="input mt-3"/>

                <input {...register("email", { required: true })} placeholder="Email Address" className="input mt-3" disabled/>
              </div>

              {/* ================= BUTTONS ================= */}
              <div className="pt-4">
                <button type="submit" disabled={isSubmitting} className="bg-primary text-white px-5 py-2 rounded-md flex justify-center items-center cursor-pointer">
                  {isSubmitting ? (<Loader2 className="animate-spin duration-300"/>) : ("Update Profile")}
                </button>
              </div>
            </form>)}
        </div>
      </div>
    </>);
}
export default Profile;
