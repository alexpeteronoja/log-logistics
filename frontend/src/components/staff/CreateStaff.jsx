import { Loader2, X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { useOpenCreateStaffStore } from "../../zustandStores/openModalStore";
import { useAdminStaffSignUp } from "../../datahooks/authentication/authenticationHook";
import { notifyError, notifySuccess } from "../../utils/toast";
import axios from "axios";
function CreateStaff() {
    const { closeCreateStaffStore, isCreateStaffStoreOpen } = useOpenCreateStaffStore();
    const { adminStaffSignupMutateAsync } = useAdminStaffSignUp();
    const { register, control, handleSubmit, formState: { isSubmitting }, reset, } = useForm({
        defaultValues: {
            // status: "pending",
            role: "operator",
        },
    });
    const passwordMatch = useWatch({
        control,
        name: "password",
    });
    const onSubmit = async (data) => {
        try {
            await adminStaffSignupMutateAsync({
                name: data.name,
                email: data.email,
                role: data.role,
                phoneNumber: data.phoneNumber,
                password: data.password,
                passwordConfirm: data.passwordConfirm,
            });
            notifySuccess("Staff Added");
            reset();
            closeCreateStaffStore();
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
      {/* Modal */}
      {isCreateStaffStoreOpen && (<div className="pt-24 pb-10 ml-0 lg:ml-71 px-4 md:px-8.5 bg-background text-textcol min-h-dvh">
          <div className="bg-white w-full p-6 relative rounded-md">
            {/* Close Button */}
            <button onClick={closeCreateStaffStore} className="absolute right-4 top-4 cursor-pointer text-gray-500 hover:text-black">
              <X size={22}/>
            </button>

            <h2 className="text-2xl font-semibold mb-6">Add Staff</h2>

            {/* Form Details */}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* ================= RECIPIENT ================= */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Staff Details</h3>

                <input {...register("name", { required: true })} placeholder="Full Name" className="input"/>

                <input {...register("email", { required: true })} placeholder="Email Address" className="input mt-3"/>

                <input {...register("phoneNumber")} placeholder="Phone Number" className="input mt-3"/>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Password Details</h3>

                <input {...register("password", { required: true })} placeholder="Password" className="input" type="password"/>

                <input {...register("passwordConfirm", {
            required: true,
            validate: (value) => value === passwordMatch || "Password does not match",
        })} type="password" placeholder="Confirm Password" className="input mt-3"/>
              </div>

              {/* ================= PACKAGE ================= */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Role</h3>

                <select {...register("role")} className="input mt-3">
                  <option value="admin">Admin</option>
                  <option value="coordinator">Coordinator</option>
                  <option value="operator">Operator</option>
                </select>
              </div>

              {/* ================= BUTTONS ================= */}
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeCreateStaffStore} className="border px-5 py-2 rounded-md cursor-pointer">
                  Cancel
                </button>

                <button type="submit" disabled={isSubmitting} className="bg-primary text-white px-5 py-2 rounded-md flex justify-center items-center cursor-pointer">
                  {isSubmitting ? (<Loader2 className="animate-spin duration-300"/>) : ("Create Shipment")}
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </>);
}
export default CreateStaff;
