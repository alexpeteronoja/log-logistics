import { useQuery } from "@tanstack/react-query";
import client from "../../api/client";
export const useGetOverview = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["overview"],
        queryFn: async () => {
            try {
                const response = await client.get("/shipments/overview");
                return response?.data || [];
            }
            catch (err) {
                console.error(err);
            }
        },
    });
    return {
        getOverview: data?.data,
        getOverviewLoading: isLoading,
        getOverviewError: isError,
    };
};
