import { z } from "zod";

const isBinaryString = (str: string): boolean => /^[01]+$/.test(str.trim());

const parseNumbers = (input: string): number[] => {
  return input
    .split(/[,\s\n\r]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !isNaN(n));
};

export const checkerSchema = z.object({
  count: z
    .string()
    .trim()
    .min(1, "Обязательное поле")
    .refine(
      (val) => {
        return isBinaryString(val) || parseNumbers(val).length > 0;
      },
      {
        message:
          "Введите числа (через пробел/запятую) или бинарную строку (0 и 1)",
      }
    ),
  checkbox: z.boolean(),
});

export type ICheckerSchema = z.infer<typeof checkerSchema>;
