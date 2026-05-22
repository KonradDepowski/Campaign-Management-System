import { BACKEND_URL } from "@/data";
import { useQuery } from "@tanstack/react-query";

const useQueryKeywords = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["keywords"],
    queryFn: async () => {
      const response = await fetch(`${BACKEND_URL}/keywords`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
  return { keywords: data, isLoading, error };
};

export default useQueryKeywords;
