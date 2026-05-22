import { BACKEND_URL } from "@/data";
import { useQuery } from "@tanstack/react-query";

const useQueryCampaigns = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const response = await fetch(`${BACKEND_URL}/campaigns`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  return { campaigns: data, isLoading, error };
};

export default useQueryCampaigns;
