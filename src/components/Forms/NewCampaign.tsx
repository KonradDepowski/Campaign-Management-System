import { useSearchParams } from "react-router-dom";
import useQueryProduct from "@/hooks/useQueryProduct";
import useQueryCampaign from "@/hooks/useQueryCampaign";
import useQueryTowns from "@/hooks/useQueryTowns";
import { Spinner } from "../ui/spinner";
import { CampaignForm } from "./CampaignForm";

export function NewCampaign({ productId }: { productId: string | undefined }) {
  const [searchParams] = useSearchParams();
  const editCampaignId = searchParams.get("edit");
  const { product, isLoading, error } = useQueryProduct(productId ?? "");

  const {
    campaign,
    isLoading: isCampaignLoading,
    error: campaignError,
  } = useQueryCampaign(editCampaignId);

  const {
    towns,
    isLoading: isTownsLoading,
    error: townsError,
  } = useQueryTowns();

  if (isLoading || (editCampaignId && isCampaignLoading) || isTownsLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="12" />
      </div>
    );
  }

  if (error || (editCampaignId && campaignError) || townsError) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">
          Error loading campaign:{" "}
          {error?.message || campaignError?.message || townsError?.message}
        </p>
      </div>
    );
  }

  return (
    <CampaignForm
      key={editCampaignId ?? "new"}
      campaign={campaign}
      towns={towns ?? []}
      product={product!}
      productId={productId}
      editCampaignId={editCampaignId}
    />
  );
}
