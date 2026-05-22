import type { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useQueryProducts = () => {
  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch(`/api/products`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json() as Promise<Product[] | []>;
    },
  });

  return { products: data ?? [], isLoading, error };
};

export default useQueryProducts;
