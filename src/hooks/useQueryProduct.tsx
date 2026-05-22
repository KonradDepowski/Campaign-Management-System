import type { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useQueryProduct = (productId: string) => {
  const { data, isLoading, error } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await fetch(`/api/product/${productId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json() as Promise<Product>;
    },
  });

  return { product: data, isLoading, error };
};

export default useQueryProduct;
