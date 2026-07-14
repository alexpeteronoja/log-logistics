// utils/toast.ts
import { toast } from "react-toastify";
export const notifySuccess = (message) => toast.success(message, {
    toastId: message,
});
export const notifyError = (message) => toast.error(message, {
    toastId: message,
});
