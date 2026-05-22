import type { Campaign } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useQueryCampaigns = () => {
  const { data, isLoading, error } = useQuery<Campaign[]>({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const response = await fetch(`/api/campaigns`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json() as Promise<Campaign[] | []>;
    },
  });

  return { campaigns: data ?? [], isLoading, error };
};

export default useQueryCampaigns;
