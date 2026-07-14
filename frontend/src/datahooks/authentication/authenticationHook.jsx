import { useMutation } from "@tanstack/react-query";
import client from "../../api/client";
// import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
export const useAdminStaffSignUp = () => {
    const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
        mutationFn: (data) => client.post("/auth/register", data),
        onError: (err) => {
            console.error("error", err?.response?.data);
        },
    });
    return {
        adminStaffSignupMutate: mutate,
        adminStaffSignupMutateAsync: mutateAsync,
        adminStaffSignupPending: isPending,
        adminStaffSignupError: isError,
        adminStaffSignupSuccess: isSuccess,
    };
};
// Login
export const useUserLogin = () => {
    // const navigate = useNavigate();
    // Function to Fetch Store
    const { mutate, mutateAsync, isPending } = useMutation({
        mutationFn: (data) => client.post("/auth/login", data),
        onSuccess: async (response) => {
            const userRole = response?.data?.data?.user?.role;
            const userId = response?.data?.data?.user?._id;
            const userEmail = response?.data?.data?.user?.email;
            // Clear Previous Access Token and Role to Avoid Conflict\
            Cookies.remove("userAccessToken");
            Cookies.remove("userId");
            Cookies.remove("userEmail");
            Cookies.remove("userRole");
            Cookies.remove("userRefreshToken");
            try {
                if (userRole) {
                    Cookies.set("userAccessToken", response?.data?.data?.accessToken, {
                        secure: true,
                        sameSite: "None",
                    });
                    Cookies.set("userRefreshToken", response?.data?.data?.refreshToken, {
                        secure: true,
                        sameSite: "None",
                    });
                    Cookies.set("userId", userId, {
                        secure: true,
                        sameSite: "None",
                    });
                    Cookies.set("userEmail", userEmail, {
                        secure: true,
                        sameSite: "None",
                    });
                    Cookies.set("userRole", userRole, {
                        secure: true,
                        sameSite: "None",
                    });
                    // if (userRole === "record_label") {
                    //   navigate("/label/dashboard");
                    // } else if (userRole === "independent_artist") {
                    //   navigate("/dashboard", { replace: true });
                    // }
                }
                // if (userRole === 'independent_artist') {
                //   localStorage.setItem('artistRole', userRole);
                //   Cookies.set('artistAccessToken', response?.data?.data?.access_token, {
                //     secure: true,
                //     sameSite: 'None',
                //   });
                //   Cookies.set(
                //     'artistRefreshToken',
                //     response?.data?.data?.refresh_access_token,
                //     { secure: true, sameSite: 'None' }
                //   );
                //   localStorage.setItem('artistId', userId);
                //   localStorage.setItem('userEmail', userEmail);
                //   navigate('/dashboard');
                // }
            }
            catch (err) {
                console.error(err);
            }
        },
        onError: (err) => {
            console.error(err);
        },
    });
    return {
        signinMutate: mutate,
        signinMutateAsync: mutateAsync,
        signinPending: isPending,
    };
};
// Update Password (Self)
export const useUpdatePassword = () => {
    const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
        mutationFn: (data) => client.patch("/auth/update-password", data),
        onError: (err) => {
            console.error("error", err?.response?.data);
        },
    });
    return {
        updatePasswordMutate: mutate,
        updatePasswordMutateAsync: mutateAsync,
        updatePasswordPending: isPending,
        updatePasswordError: isError,
        updatePasswordSuccess: isSuccess,
    };
};
// Logout
export const useLogOut = () => {
    const navigate = useNavigate();
    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            Cookies.remove("userAccessToken");
            Cookies.remove("userId");
            Cookies.remove("userEmail");
            Cookies.remove("userRole");
            Cookies.remove("userRefreshToken");
        },
        onSuccess: () => {
            navigate("/admin");
        },
        onError: (err) => {
            console.error(err);
        },
    });
    return { logoutMutate: mutate, logoutPending: isPending };
};
