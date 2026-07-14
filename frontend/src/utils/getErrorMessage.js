import axios from "axios";
import { notifyError } from "./toast";
export const getErrorMessage = (err) => {
    if (axios.isAxiosError(err)) {
        notifyError(err.response?.data?.message);
    }
    else {
        console.log(err);
    }
};
