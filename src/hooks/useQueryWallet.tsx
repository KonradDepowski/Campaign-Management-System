import { useQuery } from "@tanstack/react-query";

const useQueryWallet = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      const response = await fetch("/api/wallet");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  return { wallet: data, isLoading, error };
};
export default useQueryWallet;
