import { BACKEND_URL } from "@/data";
import { useQuery } from "@tanstack/react-query";

const useQueryProducts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch(`${BACKEND_URL}/products`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  return { products: data, isLoading, error };
};

export default useQueryProducts;
