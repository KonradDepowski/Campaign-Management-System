import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteCampaign = (options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (err: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await fetch(`/api/campaign/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to delete campaign");
      }

      const text = await res.text();
      return text ? JSON.parse(text) : null;
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
