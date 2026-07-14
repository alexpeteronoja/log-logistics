import { create } from "zustand";
export const useOpenAddShipmentStores = create((set) => ({
    isAddShipmentOpen: false,
    openAddShipment: () => set({
        isAddShipmentOpen: true,
    }),
    closeAddShipment: () => set({
        isAddShipmentOpen: false,
    }),
}));
export const useTrackingStores = create((set) => ({
    isAddTrackingOpen: false,
    trackingDataStore: null,
    openAddTracking: () => set({
        isAddTrackingOpen: true,
    }),
    setTrackingDataStore: (value) => set({
        trackingDataStore: value,
    }),
    closeAddTracking: () => set({
        isAddTrackingOpen: false,
        trackingDataStore: null,
    }),
}));
export const useEditShipmentStore = create((set) => ({
    editShipmentStore: null,
    setEditShipmentStore: (value) => set({
        editShipmentStore: value,
    }),
    closeEditShipmentStore: () => set({
        editShipmentStore: null,
    }),
}));
export const useOpenCreateStaffStore = create((set) => ({
    isCreateStaffStoreOpen: false,
    openCreateStaffStore: () => set({
        isCreateStaffStoreOpen: true,
    }),
    closeCreateStaffStore: () => set({
        isCreateStaffStoreOpen: false,
    }),
}));
