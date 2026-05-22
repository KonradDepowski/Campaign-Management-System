import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { WalletUpdate } from "@/types";

const useUpdateWallet = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedWallet: WalletUpdate) => {
      const response = await fetch(`/api/wallet`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedWallet),
      });
      if (!response.ok) {
        throw new Error("Failed to update wallet");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["wallet"], type: "all" });
      onSuccess?.();
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

export default useUpdateWallet;
