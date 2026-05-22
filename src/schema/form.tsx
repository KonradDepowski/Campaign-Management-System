import { z } from "zod";

export const campaignSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Campaign name must be at least 3 characters long." }),
  status: z.boolean().default(true),
  keywords: z
    .array(z.string())
    .min(1, { message: "Please select at least one keyword." }),
  town: z.string().optional(),
  radius: z.coerce
    .number()
    .min(1, { message: "Radius must be at least 1 km." }),
  bidAmount: z.coerce
    .number()
    .min(0.05, { message: "Minimum bid amount is 0.05." }),
  fund: z.coerce
    .number()
    .min(1, { message: "Campaign fund must be at least 1." }),
});

export type CampaignFormValues = z.infer<typeof campaignSchema>;
export type CampaignFormInput = z.input<typeof campaignSchema>;
export type CampaignFormOutput = z.output<typeof campaignSchema>;
