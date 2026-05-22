import React from "react";
import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";

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
import { KeywordsInput } from "@/components/keywords-input";
import type { Town, Product } from "@/types";
import type { CampaignFormInput, CampaignFormOutput } from "@/schema/form";

function formatPln(value: number) {
  const safe = Number.isFinite(value) ? value : 0;
  return `${safe.toFixed(2)} PLN`;
}

interface CampaignFormFieldsProps {
  form: UseFormReturn<CampaignFormInput, unknown, CampaignFormOutput>;
  towns: Town[];
  balanceAfter: number;
  product: Product;
  isEditing: boolean;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function CampaignFormFields({
  form,
  towns,
  balanceAfter,
  product,
  isEditing,
  isSubmitting,
  onSubmit,
}: CampaignFormFieldsProps) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-10">
      <h2 className="text-(--main) text-3xl font-bold tracking-tight md:text-4xl">
        {isEditing ? "Edit Campaign" : "New Campaign"}
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
        onSubmit={onSubmit}
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
                  <div className="ml-auto pt-1">
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
                      {towns.map((town) => (
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
                    Radius (km) <span className="text-destructive">*</span>
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
              className="h-11 px-6 text-base cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              id="btn-submit"
              disabled={isSubmitting}
              className="h-11 px-6 text-base cursor-pointer"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : "Save and Promote"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
