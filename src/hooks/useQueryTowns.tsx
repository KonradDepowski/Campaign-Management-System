import { useQuery } from "@tanstack/react-query";

const useQueryTowns = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["towns"],
    queryFn: async () => {
      const response = await fetch(`/api/towns`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  return { towns: data, isLoading, error };
};

export default useQueryTowns;
