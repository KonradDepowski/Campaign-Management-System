import { useSearchParams } from "react-router-dom";
import { DataTable } from "../data-table";
import { NewCampaign } from "../Forms/NewCampaign";
import useQueryCampaigns from "@/hooks/useQueryCampaigns";
import { Spinner } from "../ui/spinner";

const Campaigns = () => {
  const [searchParams] = useSearchParams();
  const editCampaignId = searchParams.get("edit");

  const { campaigns, isLoading, error } = useQueryCampaigns();
  const editCampaign = campaigns?.find((c) => c.id === editCampaignId);

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
        <p className="text-red-500">Error loading campaigns: {error.message}</p>
      </div>
    );
  }

  return (
    <>
      {!editCampaignId && <DataTable data={campaigns} />}
      {editCampaignId && <NewCampaign productId={editCampaign?.productId} />}
    </>
  );
};

export default Campaigns;
