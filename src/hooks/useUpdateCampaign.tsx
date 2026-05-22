import { BACKEND_URL } from "@/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateCampaign = (options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (err: unknown) => void;
  id: string;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedCampaign: Partial<Campaign>) => {
      const response = await fetch(`${BACKEND_URL}/campaign/${options?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCampaign),
      });
      if (!response.ok) {
        throw new Error("Failed to update campaign");
      }
      return response.json();
    },
    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        queryKey: ["campaigns"],
        type: "all",
      });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
};

export default useUpdateCampaign;
