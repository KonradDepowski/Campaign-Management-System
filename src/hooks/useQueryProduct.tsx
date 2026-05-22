import { BACKEND_URL } from "@/data";
import { useQuery } from "@tanstack/react-query";

const useQueryProduct = (productId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await fetch(`${BACKEND_URL}/product/${productId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  return { product: data, isLoading, error };
};

export default useQueryProduct;
