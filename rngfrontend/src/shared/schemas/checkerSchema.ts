import z from "zod";
export const checkerSchema = z.object({
  count: z.number().min(0),
  checkbox: z.boolean().optional().default(false),
});

export type ICheckerSchema = z.infer<typeof checkerSchema>;
