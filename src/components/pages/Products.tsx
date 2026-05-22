import ProductCard from "../Cards/ProductCard";
import { useSearchParams } from "react-router-dom";
import { NewCampaign } from "../Forms/NewCampaign";
import useQueryProducts from "@/hooks/useQueryProducts";

const Products = () => {
  const [searchParams] = useSearchParams();
  const createCampaignFor = searchParams.get("createCampaignFor");

  const { products, isLoading, error } = useQueryProducts();

  if (isLoading) {
    return <div>Loading products...</div>;
  }
  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  return (
    <section className="p-4">
      {!createCampaignFor && (
        <ul className="flex gap-8 flex-wrap">
          {products?.map((product) => (
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
