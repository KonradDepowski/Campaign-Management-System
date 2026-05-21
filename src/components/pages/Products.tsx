import { products } from "@/data";
import ProductCard from "../Cards/ProductCard";

const Products = () => {
  return (
    <section className="p-4">
      <ul className="flex gap-8">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard
              name={product.name}
              price={product.price}
              stock={product.stock}
              imageUrl={product.imageUrl}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Products;
