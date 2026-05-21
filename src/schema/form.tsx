import { z } from "zod";

export const campaignSchema = z.object({
  // Name: Required string, minimum 3 characters
  name: z
    .string()
    .min(3, { message: "Campaign name must be at least 3 characters long." }),

  // Status: Boolean (default to true/on)
  status: z.boolean().default(true),

  // Keywords: Require an array of strings with at least 1 item
  keywords: z
    .array(z.string())
    .min(1, { message: "Please select at least one keyword." }),

  // Town: Optional (if the user doesn't select a specific city)
  town: z.string().optional(),

  // Radius: Number, minimum 1 km
  radius: z.coerce
    .number()
    .min(1, { message: "Radius must be at least 1 km." }),

  // Bid Amount: Number, minimum 0.05
  bidAmount: z.coerce
    .number()
    .min(0.05, { message: "Minimum bid amount is 0.05." }),

  // Fund: Number, minimum 1
  fund: z.coerce
    .number()
    .min(1, { message: "Campaign fund must be at least 1." }),
});

// Optional: Infer the type for TypeScript
export type CampaignFormValues = z.infer<typeof campaignSchema>;
