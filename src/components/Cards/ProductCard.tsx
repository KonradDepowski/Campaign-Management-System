import { Link } from "react-router-dom";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

import type { Product } from "@/types";

type ProductCardProps = Product;

const ProductCard = ({
  id,
  name,
  price,
  stock,
  imageUrl,
}: ProductCardProps) => {
  return (
    <Card className="p-0 w-80 pb-6">
      <CardHeader className="p-0">
        <img src={imageUrl} alt={name} />
      </CardHeader>
      <CardContent>
        <CardTitle className="text-center">{name}</CardTitle>
        <p className="text-center text-sm text-gray-500">PLN{price}</p>
        <p className="text-center text-sm text-gray-500">{stock} in stock</p>
      </CardContent>

      <CardAction className="flex justify-center items-center w-full px-6">
        <Link
          to={`/products?createCampaignFor=${id}`}
          className="p-3 bg-[#50C878] text-black text-md rounded-xl w-full text-center hover:bg-[#50C878]/90 cursor-pointer"
        >
          Create Campaign
        </Link>
      </CardAction>
    </Card>
  );
};

export default ProductCard;
