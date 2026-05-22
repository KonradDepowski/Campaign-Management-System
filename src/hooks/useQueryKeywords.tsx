import type { Keyword } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useQueryKeywords = () => {
  const { data, isLoading, error } = useQuery<Keyword[]>({
    queryKey: ["keywords"],
    queryFn: async () => {
      const response = await fetch(`/api/keywords`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json() as Promise<Keyword[]>;
    },
  });
  return { keywords: data, isLoading, error };
};

export default useQueryKeywords;
