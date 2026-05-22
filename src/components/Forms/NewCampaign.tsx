import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KeywordsInput } from "@/components/ui/keywords-input";
import { campaignSchema } from "@/schema/form";
import { useSearchParams } from "react-router-dom";
import useQueryProduct from "@/hooks/useQueryProduct";
import useQueryCampaign from "@/hooks/useQueryCampaign";
import useQueryTowns from "@/hooks/useQueryTowns";
import useCreateCampaign from "@/hooks/useCreateCampaign";
import useUpdateCampaign from "@/hooks/useUpdateCampaign";
import useQueryWallet from "@/hooks/useQueryWallet";
import useUpdateWallet from "@/hooks/useUpdateWallet";

type FormInput = z.input<typeof campaignSchema>;
type FormOutput = z.output<typeof campaignSchema>;

function formatPln(value: number) {
  const safe = Number.isFinite(value) ? value : 0;
  return `${safe.toFixed(2)} PLN`;
}

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
    return <div>Loading campaign...</div>;
  }
  if (error || (editCampaignId && campaignError) || townsError) {
    return (
      <div>
        Error loading campaign:{" "}
        {error?.message || campaignError?.message || townsError?.message}
      </div>
    );
  }

  return (
    <CampaignFormInner
      key={editCampaignId ?? "new"}
      campaign={campaign}
      towns={towns ?? []}
      product={product}
      productId={productId}
      editCampaignId={editCampaignId}
    />
  );
}

type Town = { id: number; name: string };
type Keyword = { id: number; name: string } | string;

type CampaignData = {
  name: string;
  status: boolean;
  keywords: Keyword[];
  town: string;
  radius: number | string;
  bidAmount: number | string;
  fund: number | string;
  productId?: string;
};

function CampaignFormInner({
  campaign,
  towns,
  product,
  productId,
  editCampaignId,
}: {
  campaign?: CampaignData;
  towns: Town[];
  product: { name: string };
  productId: string | undefined;
  editCampaignId: string | null;
}) {
  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(campaignSchema),
    defaultValues: campaign
      ? {
          name: campaign.name,
          status: campaign.status,
          keywords: (campaign.keywords ?? []).map((k) =>
            typeof k === "string" ? k : k.name,
          ),
          town: campaign.town ?? "Warszawa",
          radius: String(campaign.radius),
          bidAmount: String(campaign.bidAmount),
          fund: String(campaign.fund),
        }
      : {
          name: "",
          status: true,
          keywords: [],
          town: "Warszawa",
          radius: "",
          bidAmount: "",
          fund: "500",
        },
  });

  const { wallet } = useQueryWallet();
  const { mutate: updateWallet } = useUpdateWallet();

  const { mutate: createCampaign } = useCreateCampaign({
    onSuccess: () => {
      const fundValue = Number(form.getValues("fund"));
      const currentBalance = Number(wallet?.balance ?? 0);
      if (!Number.isNaN(currentBalance) && !Number.isNaN(fundValue)) {
        updateWallet({ balance: String(currentBalance - fundValue) });
      }
      toast("Kampania zapisana", { position: "bottom-right" });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Błąd zapisu kampanii", {
        position: "bottom-right",
      });
    },
  });

  const { mutate: update } = useUpdateCampaign({
    id: editCampaignId ?? "",
    onSuccess: () => {
      toast("Kampania zaktualizowana", { position: "bottom-right" });
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Błąd aktualizacji kampanii",
        { position: "bottom-right" },
      );
    },
  });

  const fund = form.watch("fund");
  const fundNumber = Number.parseFloat(String(fund ?? 0));
  const currentBalance = Number(wallet?.balance ?? 0);
  const balanceAfter =
    currentBalance - (Number.isFinite(fundNumber) ? fundNumber : 0);

  function onSubmit(values: FormOutput) {
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
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-10">
      <h2 className="text-(--main) text-3xl font-bold tracking-tight md:text-4xl">
        New Campaign
      </h2>
      <p className="mt-2 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
        Fill out the form below to create a new advertising campaign for your
        product.
      </p>
      <p className="mt-2 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
        Creating a campaign for product: {product.name}
      </p>
      <form
        id="campaignForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8 w-full space-y-8 text-base"
      >
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="campaign-name">
                  Campaign Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="campaign-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. Spring Sale 2026"
                  className="h-11 text-base"
                  required
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="status"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="rounded-md border p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="space-y-1">
                    <FieldTitle>
                      Campaign Status{" "}
                      <span className="text-destructive">*</span>
                    </FieldTitle>
                    <FieldDescription className="text-sm">
                      The campaign will start immediately after saving.
                    </FieldDescription>
                  </div>
                  <div className="ml-auto pt-1 ">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="keywords"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Keywords <span className="text-destructive">*</span>
                </FieldLabel>
                <KeywordsInput
                  value={field.value ?? []}
                  onChange={field.onChange}
                  placeholder="Type to search keywords..."
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <Controller
              name="town"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>City</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      className="h-11 text-base"
                    >
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {towns?.map((town: { id: number; name: string }) => (
                        <SelectItem
                          className="h-12"
                          key={town.id}
                          value={town.name}
                        >
                          {town.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="radius"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="campaign-radius">
                    Radius (Radius in km){" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="campaign-radius"
                    type="number"
                    min={1}
                    placeholder="e.g. 20"
                    required
                    aria-invalid={fieldState.invalid}
                    className="h-11 text-base"
                    value={String(field.value ?? "")}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Controller
              name="bidAmount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="campaign-bid">
                    Bid Amount <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="campaign-bid"
                    type="number"
                    step="0.01"
                    min="0.05"
                    placeholder="Min. 0.05 PLN"
                    required
                    aria-invalid={fieldState.invalid}
                    className="h-11 text-base"
                    value={String(field.value ?? "")}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="fund"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="input-fund">
                    Fund <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="input-fund"
                    type="number"
                    step="1"
                    min="1"
                    placeholder="e.g. 500"
                    required
                    aria-invalid={fieldState.invalid}
                    className="h-11 text-base"
                    value={String(field.value ?? "")}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border bg-muted/40 px-5 py-4 text-base">
            <span className="text-muted-foreground">
              Balance after creating the campaign:
            </span>
            <strong
              id="calc-result"
              className="tabular-nums text-base font-semibold text-(--main)"
            >
              {formatPln(balanceAfter)}
            </strong>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className="h-11 px-6 text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              id="btn-submit"
              className="h-11 px-6 text-base"
            >
              Save and Promote
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
