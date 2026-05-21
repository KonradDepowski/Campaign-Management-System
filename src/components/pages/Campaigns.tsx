import { useSearchParams } from "react-router-dom";
import { DataTable } from "../data-table";
import { campaigns } from "@/data";
import { NewCampaign } from "../Forms/NewCampaign";

const Campaigns = () => {
  const [searchParams] = useSearchParams();
  const editCampaignId = searchParams.get("edit");
  const editCampaign = campaigns.find((c) => c.id === editCampaignId);
  return (
    <>
      {!editCampaignId && <DataTable data={campaigns} />}
      {editCampaignId && <NewCampaign productId={editCampaign?.productId} />}
    </>
  );
};

export default Campaigns;
