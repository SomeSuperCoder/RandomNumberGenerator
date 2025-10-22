// shared/schemas/generateSchema.ts
import { z } from "zod";

// Универсальный числовой field: '' | NaN -> undefined -> "Введите ..."
const numberField = (label: string) =>
  z.preprocess((v) => {
    if (v === "" || v == null) return undefined; // пустая строка / null / undefined
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : undefined; // NaN/Infinity -> undefined
  }, z.number({ required_error: `Введите ${label}` }).finite());

export const generateSchema = z
  .object({
    min: numberField("минимум"),
    max: numberField("максимум"),
    count: numberField("количество"),
    checkbox: z.boolean().optional().default(false),
  })
  .superRefine((v, ctx) => {
    if (v.min !== undefined && v.max !== undefined && v.min > v.max) {
      ctx.addIssue({
        path: ["max"],
        code: "custom",
        message: "Максимум должен быть ≥ минимума",
      });
    }
  });

export type IGenerateSchema = z.infer<typeof generateSchema>;
