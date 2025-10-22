// shared/schemas/generateSchema.ts
import { z } from "zod";

const COUNT_MAX = 1000;

// Универсальный числовой field: '' | null | undefined | NaN -> undefined -> "Введите ..."
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

    // ВАЖНО: numberField -> pipe к "целому числу" + диапазон
    count: numberField("количество").pipe(
      z
        .number()
        .int({ message: "Должно быть целым числом" })
        .min(1, { message: "Минимум 1" })
        .max(COUNT_MAX, { message: `Максимум ${COUNT_MAX}` })
    ),

    checkbox: z.boolean().optional().default(false),
  })
  .superRefine((v, ctx) => {
    // Безопасная проверка: оба — числа
    if (
      typeof v.min === "number" &&
      typeof v.max === "number" &&
      v.min > v.max
    ) {
      ctx.addIssue({
        path: ["max"],
        code: "custom",
        message: "Максимум должен быть ≥ минимума",
      });
    }
  });

export type IGenerateSchema = z.infer<typeof generateSchema>;
