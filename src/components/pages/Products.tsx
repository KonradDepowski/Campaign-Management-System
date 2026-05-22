import ProductCard from "../Cards/ProductCard";
import { useSearchParams } from "react-router-dom";
import { NewCampaign } from "../Forms/NewCampaign";
import useQueryProducts from "@/hooks/useQueryProducts";
import { Spinner } from "../ui/spinner";

const Products = () => {
  const [searchParams] = useSearchParams();
  const createCampaignFor = searchParams.get("createCampaignFor");

  const { products, isLoading, error } = useQueryProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="12" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">Error loading products: {error.message}</p>
      </div>
    );
  }

  return (
    <section className="p-4">
      {!createCampaignFor && (
        <ul className="flex justify-center md:justify-start gap-8 flex-wrap">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                stock={product.stock}
                imageUrl={product.imageUrl}
              />
            </li>
          ))}
        </ul>
      )}

      {createCampaignFor && <NewCampaign productId={createCampaignFor} />}
    </section>
  );
};

export default Products;
