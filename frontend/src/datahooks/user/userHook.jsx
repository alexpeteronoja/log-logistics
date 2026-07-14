import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import client from "../../api/client";
// Get All Users
export const useGetAllUser = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["getAllUser"],
        queryFn: async () => {
            try {
                const response = await client.get("/users");
                return response?.data || [];
            }
            catch (err) {
                console.error(err);
            }
        },
    });
    return {
        getAllUser: data?.data?.users || [],
        getAllUserLoading: isLoading,
        getAllUserError: isError,
    };
};
// Get Me (User Self)
export const useGetMe = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["getMe"],
        queryFn: async () => {
            try {
                const response = await client.get("/auth/me");
                return response?.data || [];
            }
            catch (err) {
                console.error(err);
            }
        },
    });
    return {
        getMe: data?.data?.user,
        getMeLoading: isLoading,
        getMeError: isError,
    };
};
// Edit Me (User Self)
export const useUpdateMe = () => {
    const queryClient = useQueryClient();
    const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
        mutationFn: (data) => client.patch("/auth/me", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getMe"] });
        },
        onError: (err) => {
            console.error("Error", err?.response?.data?.data?.message);
        },
    });
    return {
        updateMeMutate: mutate,
        updateMeMutateAsync: mutateAsync,
        updateMePending: isPending,
        updateMeError: isError,
        updateMeSuccess: isSuccess,
    };
};
// Deactivate User
export const useDeactivateUser = () => {
    const queryClient = useQueryClient();
    const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
        mutationFn: ({ userId, data }) => client.patch(`/users/${userId}/toggle-status`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getAllUser"] });
        },
        onError: (err) => {
            console.error("Error", err?.response?.data?.data?.message);
        },
    });
    return {
        deactivateUserMutate: mutate,
        deactivateUserMutateAsync: mutateAsync,
        deactivateUserPending: isPending,
        deactivateUserError: isError,
        deactivateUserSuccess: isSuccess,
    };
};
// Delete User
export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
        mutationFn: (userId) => client.delete(`/users/${userId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getAllUser"] });
        },
        onError: (err) => {
            console.error("Error", err?.response?.data?.data?.message);
        },
    });
    return {
        deleteUserMutate: mutate,
        deleteUserMutateAsync: mutateAsync,
        deleteUserPending: isPending,
        deleteUserError: isError,
        deleteUserSuccess: isSuccess,
    };
};
