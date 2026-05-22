import { useQuery } from "@tanstack/react-query";

const useQueryCampaign = (id: string | null) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["campaign", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await fetch(`/api/campaign/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  return { campaign: data, isLoading, error };
};

export default useQueryCampaign;
