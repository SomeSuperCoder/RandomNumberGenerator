import {
  generateSchema,
  type IGenerateSchema,
} from "@/shared/schemas/generateSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import type { TRngParams } from "@/shared/interafaces/interfaces";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
      count: 1,
      // min, max, checkbox удалены — они не нужны
    },
    resolver: zodResolver(generateSchema),
    mode: "onSubmit",
  });

  const submit = (data: IGenerateSchema) => {
    const params: TRngParams = {
      full_random: false,
      binary: false,
      amount: data.count,
    };
    onGenerate(params);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="pointer-events-auto w-full max-w-[720px] rounded-xl border border-[#2a313a] bg-gradient-to-b from-black/18 to-transparent bg-[#11161c] p-2.5 shadow-[0_6px_24px_rgba(0,0,0,0.35)]"
    >
      <div className="grid grid-cols-1 gap-3">
        {" "}
        <div className="flex flex-col">
          <Label htmlFor="count" className="mb-1 text-[#9aa3ad] text-sm">
            Количество
          </Label>
          <Input
            type="number"
            id="count"
            max={1000}
            placeholder="Количество"
            className="h-9 w-full rounded-lg border border-[#2a313a] bg-[#171c23] px-3 py-0 text-[#e6e7ea] outline-none placeholder:text-[#9aa3ad] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            {...register("count", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
          />
          {errors.count?.message && (
            <span className="min-h-[14px] mt-1 text-xs text-[#ff6b6b]">
              {errors.count.message}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 w-full rounded-lg border border-[#2a313a] bg-[#1a2129] font-semibold text-[#e6e7ea] transition hover:brightness-105 active:translate-y-px disabled:opacity-50"
        >
          Генерировать
        </button>
      </div>
    </form>
  );
};

export default GenerateForm;
