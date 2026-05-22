import { BACKEND_URL } from "@/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const useCreateCampaign = (options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (err: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch(`${BACKEND_URL}/campaign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to create campaign");
      }

      return res.json();
    },
    onSuccess: async (data) => {
      options?.onSuccess?.(data as unknown);

      await queryClient.refetchQueries({
        queryKey: ["campaigns"],
        type: "all",
      });
      navigate("/campaigns");
    },
    onError: (err) => {
      console.error(err);

      options?.onError?.(err);
    },
  });
};

export default useCreateCampaign;
