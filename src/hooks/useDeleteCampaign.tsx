import { BACKEND_URL } from "@/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteCampaign = (options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (err: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await fetch(`${BACKEND_URL}/campaign/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to delete campaign");
      }

      return res.json();
    },
    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        queryKey: ["campaigns"],
        type: "all",
      });

      options?.onSuccess?.(data as unknown);
    },
    onError: (err) => {
      console.error(err);

      options?.onError?.(err);
    },
  });
};

export default useDeleteCampaign;
