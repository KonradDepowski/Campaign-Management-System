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
import { availableKeywords, availableTowns, campaigns } from "@/data";

const STARTING_BALANCE_PLN = 4750;

type FormInput = z.input<typeof campaignSchema>;
type FormOutput = z.output<typeof campaignSchema>;

function formatPln(value: number) {
  const safe = Number.isFinite(value) ? value : 0;
  return `${safe.toFixed(2)} PLN`;
}

export function NewCampaign({ productId }: { productId: string }) {
  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      status: true,
      keywords: [],
      town: "Warszawa",
      radius: "",
      bidAmount: "",
      fund: "500",
    },
  });

  const fund = form.watch("fund");
  const fundNumber = Number.parseFloat(String(fund ?? 0));
  const balanceAfter =
    STARTING_BALANCE_PLN - (Number.isFinite(fundNumber) ? fundNumber : 0);

  function onSubmit(values: FormOutput) {
    let campaignData = {
      id: `camp_${Math.floor(Math.random() * 10000)}`,
      ...values,
      productId: productId,
    };

    campaigns.push(campaignData);

    console.log(campaigns);

    toast("Kampania zapisana", {
      description: (
        <pre className="mt-2 w-90 overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>
            {JSON.stringify(
              {
                ...values,
                balanceAfter: balanceAfter,
              },
              null,
              2,
            )}
          </code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
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
        Creating a campaign for product ID: {productId}
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
                  suggestions={availableKeywords}
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
                  >
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      className="h-11 text-base"
                    >
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTowns.map((town) => (
                        <SelectItem className="h-12" key={town} value={town}>
                          {town}
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
