// src/widgets/components/Forms/GenerateForm.tsx
import {
  generateSchema,
  type IGenerateSchema,
} from "@/shared/schemas/generateSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import type { TRngParams } from "@/shared/interafaces/interfaces";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Тип пропсов
interface GenerateFormProps {
  onGenerate: (params: TRngParams) => void;
}

const GenerateForm = ({ onGenerate }: GenerateFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IGenerateSchema>({
    defaultValues: {
      min: 0,
      max: 0,
      count: 1,
      checkbox: false,
    },
    resolver: zodResolver(generateSchema),
    mode: "onSubmit",
  });

  const submit = (data: IGenerateSchema) => {
    const params: TRngParams = {
      full_random: data.checkbox,
      binary: false, // или получите из схемы, если нужно
      amount: data.count,
      // min/max не используются в запросе к /rng?
      // Если нужны — добавьте их в TRngParams и сюда
    };
    onGenerate(params);
    reset(); // сброс полей формы (опционально)
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="pointer-events-auto w-full max-w-[720px] rounded-xl border border-[#2a313a] bg-gradient-to-b from-black/18 to-transparent bg-[#11161c] p-2.5 shadow-[0_6px_24px_rgba(0,0,0,0.35)]"
    >
      <div className="grid grid-cols-3 gap-3">
        {(["min", "count", "max"] as const).map((field) => (
          <div key={field} className="flex flex-col">
            <Label htmlFor={field} className="mb-1 text-[#9aa3ad] text-sm">
              {field === "min"
                ? "Минимум"
                : field === "max"
                ? "Максимум"
                : "Количество"}
            </Label>
            <Input
              type="number"
              max={1000}
              placeholder={
                field === "min"
                  ? "Минимум"
                  : field === "max"
                  ? "Максимум"
                  : "Количество"
              }
              id={field}
              className="h-9 w-full rounded-lg border border-[#2a313a] bg-[#171c23] px-3 py-0 text-[#e6e7ea] outline-none placeholder:text-[#9aa3ad] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              {...register(field, {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
            {errors[field]?.message && (
              <span className="min-h-[14px] mt-1 text-xs text-[#ff6b6b]">
                {errors[field].message}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 w-full rounded-lg border border-[#2a313a] bg-[#1a2129] font-semibold text-[#e6e7ea] transition hover:brightness-105 active:translate-y-px disabled:opacity-50"
        >
          Генерировать
        </button>

        <label className="inline-flex items-center gap-2 text-[#e6e7ea] select-none">
          <input
            type="checkbox"
            className="size-4.5 appearance-none rounded-sm border border-[#2a313a] bg-[#171c23] checked:border-[#2f6feb] checked:bg-[#2f6feb]"
            {...register("checkbox")}
          />
          <span>Визуализация</span>
        </label>
        {errors.checkbox?.message && (
          <span className="col-start-2 mt-1 text-xs text-[#ff6b6b]">
            {errors.checkbox.message}
          </span>
        )}
      </div>
    </form>
  );
};

export default GenerateForm;
