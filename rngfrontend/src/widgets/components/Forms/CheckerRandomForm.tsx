// src/widgets/components/Forms/CheckerRandomForm.tsx
import {
  checkerSchema,
  type ICheckerSchema,
} from "@/shared/schemas/checkerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useApiBodyMutation } from "@/features/api/react-query";
import type {
  AuditResponse,
  CheckerRandomFormProps,
} from "@/shared/interafaces/interfaces";

const CheckerRandomForm = ({
  onAuditSuccess,
  onAuditError,
}: CheckerRandomFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ICheckerSchema>({
    resolver: zodResolver(checkerSchema),
    defaultValues: {
      count: "",
      checkbox: false,
    },
    mode: "onSubmit",
  });

  const binaryMutation = useApiBodyMutation<AuditResponse, string>(
    { url: "/audit/bin", method: "POST" },
    {
      onSuccess: (response) => onAuditSuccess(response),
      onError: (error) => {
        console.error("Ошибка бинарной проверки:", error);
        onAuditError();
      },
    }
  );

  const intMutation = useApiBodyMutation<AuditResponse, number[]>(
    { url: "/audit/int", method: "POST" },
    {
      onSuccess: (response) => onAuditSuccess(response),
      onError: (error) => {
        console.error("Ошибка числовой проверки:", error);
        onAuditError();
      },
    }
  );

  const isPending = binaryMutation.isPending || intMutation.isPending;

  const submit = (data: ICheckerSchema) => {
    const input = data.count.trim();
    const isBinary = /^[01]+$/.test(input);

    if (isBinary) {
      binaryMutation.mutate(input);
    } else {
      const numbers = input
        .split(/[,\s\n\r]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map(Number)
        .filter((n) => !isNaN(n));

      if (numbers.length === 0) return;
      intMutation.mutate(numbers);
    }

    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="pointer-events-auto w-full max-w-[760px] rounded-xl border border-[#2a313a] bg-gradient-to-b from-black/18 to-transparent bg-[#11161c] p-3.5 shadow-[0_6px_24px_rgba(0,0,0,0.35)]"
    >
      <div className="flex flex-col">
        <Textarea
          disabled={isSubmitting || isPending}
          className="w-full min-h-[86px] resize-y rounded-lg border border-[#2a313a] bg-[#0f141a] px-3 py-2.5 text-sm text-[#e6e7ea] outline-none placeholder:text-[#9aa3ad] focus:border-[#2f6feb] focus:shadow-[0_0_0_3px_rgba(47,111,235,0.25)]"
          placeholder="Введите числа (через пробел, запятую или с новой строки) или бинарную строку (только 0 и 1)"
          {...register("count")}
        />
        {errors.count?.message && (
          <span className="min-h-[14px] mt-1.5 text-xs text-[#ff6b6b]">
            {errors.count.message}
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting || isPending}
          className="h-10 w-full rounded-lg border border-[#2a313a] bg-[#1a2129] font-semibold text-[#e6e7ea] transition hover:brightness-105 active:translate-y-px disabled:opacity-50"
        >
          {isPending ? "Проверка…" : "Проверить"}
        </button>

        <label className="inline-flex items-center gap-2 text-[#e6e7ea] select-none">
          <input
            type="checkbox"
            disabled={isSubmitting || isPending}
            className="size-4.5 appearance-none rounded-sm border border-[#2a313a] bg-[#0f141a] checked:border-[#2f6feb] checked:bg-[#2f6feb] checked:ring-0"
            {...register("checkbox")}
          />
          <span>Визуализация</span>
        </label>
      </div>
    </form>
  );
};

export default CheckerRandomForm;
