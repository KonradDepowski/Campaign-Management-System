import { useSearchParams } from "react-router-dom";
import { DataTable } from "../data-table";
import { NewCampaign } from "../Forms/NewCampaign";
import useQueryCampaigns from "@/hooks/useQueryCampaigns";

const Campaigns = () => {
  const [searchParams] = useSearchParams();
  const editCampaignId = searchParams.get("edit");

  const { campaigns, isLoading, error } = useQueryCampaigns();
  const editCampaign = campaigns?.find((c) => c.id === editCampaignId);


  if (isLoading) {
    return <div>Loading campaigns...</div>;
  }
  
  if (error) {
    return <div>Error loading campaigns: {error.message}</div>;
  }
  return (
    <>
      {!editCampaignId && <DataTable data={campaigns} />}
      {editCampaignId && <NewCampaign productId={editCampaign?.productId} />}
    </>
  );
};

export default Campaigns;
