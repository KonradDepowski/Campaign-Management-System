import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { campaignSchema } from "@/schema/form";
import type { CampaignFormInput, CampaignFormOutput } from "@/schema/form";
import useCreateCampaign from "@/hooks/useCreateCampaign";
import useUpdateCampaign from "@/hooks/useUpdateCampaign";
import useQueryWallet from "@/hooks/useQueryWallet";
import useUpdateWallet from "@/hooks/useUpdateWallet";
import type { Campaign, Product, Town } from "@/types";
import { CampaignFormFields } from "./CampaignFormFields";

interface CampaignFormProps {
  campaign?: Campaign;
  towns: Town[];
  product: Product;
  productId: string | undefined;
  editCampaignId: string | null;
}

export function CampaignForm({
  campaign,
  towns,
  product,
  productId,
  editCampaignId,
}: CampaignFormProps) {
  const form = useForm<CampaignFormInput, unknown, CampaignFormOutput>({
    resolver: zodResolver(campaignSchema),
    defaultValues: campaign
      ? {
          name: campaign.name,
          status: campaign.status,
          keywords: (campaign.keywords ?? []).map((k) =>
            typeof k === "string" ? k : k.name,
          ),
          town: campaign.town ?? "New York",
          radius: String(campaign.radius),
          bidAmount: String(campaign.bidAmount),
          fund: String(campaign.fund),
        }
      : {
          name: "",
          status: true,
          keywords: [],
          town: "New York",
          radius: "",
          bidAmount: "",
          fund: "500",
        },
  });

  const { wallet } = useQueryWallet();
  const { mutate: updateWallet } = useUpdateWallet();

  const { mutate: createCampaign, isPending: isCreating } = useCreateCampaign({
    onSuccess: () => {
      const fundValue = Number(form.getValues("fund"));
      const currentBalance = Number(wallet?.balance ?? 0);
      if (!Number.isNaN(currentBalance) && !Number.isNaN(fundValue)) {
        updateWallet({ balance: String(currentBalance - fundValue) });
      }
      toast("Campaign created successfully", { position: "bottom-right" });
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Error creating campaign",
        { position: "bottom-right" },
      );
    },
  });

  const { mutate: update, isPending: isUpdating } = useUpdateCampaign({
    id: editCampaignId ?? "",
    onSuccess: () => {
      toast("Campaign updated successfully", { position: "bottom-right" });
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Error updating campaign",
        { position: "bottom-right" },
      );
    },
  });

  const fund = form.watch("fund");
  const fundNumber = Number.parseFloat(String(fund ?? 0));
  const currentBalance = Number(wallet?.balance ?? 0);
  const balanceAfter =
    currentBalance - (Number.isFinite(fundNumber) ? fundNumber : 0);

  function onSubmit(values: CampaignFormOutput) {
    const fundValue = Number(values.fund);

    if (!editCampaignId && fundValue > currentBalance) {
      toast.error("Insufficient funds in the account", {
        position: "bottom-right",
      });
      return;
    }

    const campaignData = {
      ...values,
      productId: productId ?? campaign?.productId,
    };

    if (editCampaignId) {
      update({ ...campaignData, id: editCampaignId } as Record<
        string,
        unknown
      >);
    } else {
      createCampaign(campaignData as Record<string, unknown>);
    }
  }

  return (
    <CampaignFormFields
      form={form}
      towns={towns}
      balanceAfter={balanceAfter}
      product={product}
      isEditing={!!editCampaignId}
      isSubmitting={isCreating || isUpdating}
      onSubmit={form.handleSubmit(onSubmit)}
    />
  );
}
