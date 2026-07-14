import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { notifyError, notifySuccess } from "../../utils/toast";
import { useUpdatePassword } from "../../datahooks/authentication/authenticationHook";
import { getErrorMessage } from "../../utils/getErrorMessage";
function Settings() {
    const [showPassword, setShowPassword] = useState(null);
    const { updatePasswordMutateAsync, updatePasswordPending } = useUpdatePassword();
    const { register, handleSubmit, control, formState: { errors }, reset, } = useForm();
    const passwordMatch = useWatch({
        control,
        name: "newPassword",
    });
    const toggleVisibility = (value) => {
        setShowPassword((prev) => (prev === value ? null : value));
    };
    const showBtn = (typeOfPassword) => {
        return (<button type="button" onClick={() => toggleVisibility(typeOfPassword)} className="absolute top-4.5 right-4 cursor-pointer">
        {showPassword === typeOfPassword ? (<EyeOff className="w-6 h-6 text-gray-500"/>) : (<Eye className="w-6 h-6 text-gray-500"/>)}
      </button>);
    };
    const onSubmit = async (data) => {
        try {
            if (data.newPassword !== data.confirmNewPassword) {
                notifyError("Passwords do not match");
                return;
            }
            await updatePasswordMutateAsync({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
                confirmNewPassword: data.confirmNewPassword,
            });
            notifySuccess("Password Changed Succesfully");
            reset();
            // API CALL HERE
        }
        catch (err) {
            getErrorMessage(err);
            reset();
        }
    };
    return (<div className="pt-24 pb-10 ml-0 lg:ml-71 px-4 md:px-8.5 bg-background text-textcol min-h-dvh">
      <div className="pb-3 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold mb-1 text-center text-textcol">
            Update Password
          </h1>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-[#20186D] text-white rounded-lg shadow-sm p-9 w-full max-w-md">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Old Password */}
            <div className="mt-4.5">
              <label className="font-medium text-sm">Old Password</label>

              <div className="relative">
                <input type={showPassword === "oldPassword" ? "text" : "password"} placeholder="Enter Password" {...register("oldPassword", {
        required: "Old password is required",
    })} className="w-full mt-2 px-3 py-2.5 rounded-[10px] outline-0 text-sm text-[#1E1E1E] bg-[#F5F7FA] border focus:border-amber-600"/>

                {showBtn("oldPassword")}
              </div>

              {errors.oldPassword && (<p className="text-red-300 text-xs mt-1">
                  {errors.oldPassword.message}
                </p>)}
            </div>

            {/* New Password */}
            <div className="mt-4.5">
              <label className="font-medium text-sm">New Password</label>

              <div className="relative">
                <input type={showPassword === "newPassword" ? "text" : "password"} placeholder="Enter Password" {...register("newPassword", {
        required: "New password is required",
        minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
        },
    })} className="w-full mt-2 px-3 py-2.5 rounded-[10px] outline-0 text-sm text-[#1E1E1E] bg-[#F5F7FA] border focus:border-amber-600"/>

                {showBtn("newPassword")}
              </div>

              {errors.newPassword && (<p className="text-red-300 text-xs mt-1">
                  {errors.newPassword.message}
                </p>)}
            </div>

            {/* Confirm Password */}
            <div className="mt-4.5">
              <label className="font-medium text-sm">
                Confirm New Password
              </label>

              <div className="relative">
                <input type={showPassword === "confirmNewPassword" ? "text" : "password"} placeholder="Enter Password" {...register("confirmNewPassword", {
        required: "Please confirm your new password",
        validate: (value) => value === passwordMatch || "Password does not match",
    })} className="w-full mt-2 px-3 py-2.5 rounded-[10px] outline-0 text-sm text-[#1E1E1E] bg-[#F5F7FA] border focus:border-amber-600"/>

                {showBtn("confirmNewPassword")}
              </div>

              {errors.confirmNewPassword && (<p className="text-red-300 text-xs mt-1">
                  {errors.confirmNewPassword.message}
                </p>)}
            </div>

            <div className="mt-6">
              <button type="submit" className="w-full flex justify-center items-center cursor-pointer rounded-[10px] bg-accent py-3">
                {updatePasswordPending ? (<Loader2 className="animate-spin duration-300"/>) : (" Change Password")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>);
}
export default Settings;
