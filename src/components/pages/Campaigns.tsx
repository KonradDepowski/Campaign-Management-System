import { DataTable } from "../data-table";
import { campaigns } from "@/data";

const Campaigns = () => {
  return <DataTable data={campaigns} />;
};

export default Campaigns;
