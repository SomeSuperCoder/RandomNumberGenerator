import z from "zod";
export const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

export type ILogin = z.infer<typeof loginSchema>;
