import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import client from "../../api/client";
export const useGetAllShipment = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["getAllShipment"],
        queryFn: async () => {
            try {
                const response = await client.get("/shipments");
                const shipments = response?.data?.data?.shipments || [];
                return shipments.map(s => ({
                    ...s,
                    trackingCode: s.internalTrackingId,
                    senderName: s.metadata?.sender?.name,
                    senderPhoneNo: s.metadata?.sender?.phone,
                    senderAddress: s.metadata?.sender?.address,
                    recipientName: s.metadata?.receiver?.name,
                    recipientPhoneNo: s.metadata?.receiver?.phone,
                    recipientEmail: s.metadata?.recipientEmail,
                    recipientAddress: s.metadata?.receiver?.address,
                    packageDescription: s.metadata?.description,
                    packageLocation: s.metadata?.packageLocation,
                    weight: s.metadata?.weight,
                    category: s.metadata?.category,
                    estimatedDelivery: s.metadata?.estimatedDelivery,
                }));
            }
            catch (err) {
                console.error(err);
            }
        },
    });
    return {
        getAllShipment: data,
        getAllShipmentLoading: isLoading,
        getAllShipmentError: isError,
    };
};
// Create Shipment
export const useCreateShipment = () => {
    const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
        mutationFn: (data) => client.post("/shipments", data),
        onError: (err) => {
            console.error("Error", err?.response?.data?.error?.message || err.message);
        },
    });
    return {
        createShipmentMutate: mutate,
        createShipmentMutateAsync: mutateAsync,
        createShipmentPending: isPending,
        createShipmentError: isError,
        createShipmentsSuccess: isSuccess,
    };
};
// Get A Single Shipment
export const useGetShipment = (shipmentId) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["getShipment", shipmentId],
        queryFn: async () => {
            try {
                const response = await client.get(`/shipments/${shipmentId}`);
                const s = response?.data?.data?.shipment;
                if (!s) return null;
                return {
                    ...s,
                    trackingCode: s.internalTrackingId,
                    senderName: s.metadata?.sender?.name,
                    senderPhoneNo: s.metadata?.sender?.phone,
                    senderAddress: s.metadata?.sender?.address,
                    recipientName: s.metadata?.receiver?.name,
                    recipientPhoneNo: s.metadata?.receiver?.phone,
                    recipientEmail: s.metadata?.recipientEmail,
                    recipientAddress: s.metadata?.receiver?.address,
                    packageDescription: s.metadata?.description,
                    packageLocation: s.metadata?.packageLocation,
                    weight: s.metadata?.weight,
                    category: s.metadata?.category,
                    estimatedDelivery: s.metadata?.estimatedDelivery,
                };
            }
            catch (err) {
                console.error(err);
            }
        },
        enabled: !!shipmentId,
    });
    return {
        getShipment: data,
        getShipmentLoading: isLoading,
        getShipmentError: isError,
    };
};
// Public Tracking
export const usePublicTracking = (trackingCode) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["publicTracking", trackingCode],
        queryFn: async () => {
            try {
                const response = await client.get(`/track/${trackingCode}`);
                const s = response?.data?.data?.shipment;
                if (!s) return null;
                return s;
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        },
        enabled: !!trackingCode,
        retry: 2,
    });
    return {
        publicTracking: data,
        publicTrackingLoading: isLoading,
        publicTrackingError: isError,
        publicTrackingErrorMessage: error,
    };
};
// Update Shipment
export const useUpdateShipment = () => {
    const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
        mutationFn: ({ shipmentId, data }) => client.patch(`/shipments/${shipmentId}`, data),
        onError: (err) => {
            console.error("Error", err?.response?.data?.data?.message);
        },
    });
    return {
        updateShipmentMutate: mutate,
        updateShipmentMutateAsync: mutateAsync,
        updateShipmentPending: isPending,
        updateShipmentError: isError,
        updateShipmentSuccess: isSuccess,
    };
};
// Delete Shipment
export const useDeleteShipment = () => {
    const queryClient = useQueryClient();
    const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
        mutationFn: (shipmentId) => client.delete(`/shipments/${shipmentId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getAllShipment"] });
        },
        onError: (err) => {
            console.error("Error", err?.response?.data?.data?.message);
        },
    });
    return {
        deleteShipmentMutate: mutate,
        deleteShipmentMutateAsync: mutateAsync,
        deleteShipmentPending: isPending,
        deleteShipmentError: isError,
        deleteShipmentsSuccess: isSuccess,
    };
};
// Add Tracking Event
export const useAddTrackingEvent = () => {
    const queryClient = useQueryClient();
    const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
        mutationFn: ({ shipmentId, data }) => client.patch(`/shipments/${shipmentId}/events`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getAllShipment"] });
            queryClient.invalidateQueries({ queryKey: ["getShipment"] });
        },
        onError: (err) => {
            console.error("Error", err?.response?.data?.data?.message);
        },
    });
    return {
        addTrackingEventMutate: mutate,
        addTrackingEventMutateAsync: mutateAsync,
        addTrackingEventPending: isPending,
        addTrackingEventError: isError,
        addTrackingEventSuccess: isSuccess,
    };
};
// Manual Poll
export const useManualPoll = () => {
    const queryClient = useQueryClient();
    const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
        mutationFn: (shipmentId) => client.post(`/shipments/${shipmentId}/poll`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getShipment"] });
        },
        onError: (err) => {
            console.error("Error", err?.response?.data?.data?.message);
        },
    });
    return {
        manualPollMutate: mutate,
        manualPollMutateAsync: mutateAsync,
        manualPollPending: isPending,
        manualPollError: isError,
        manualPollSuccess: isSuccess,
    };
};
