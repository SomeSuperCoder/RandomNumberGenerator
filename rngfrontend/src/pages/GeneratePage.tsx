// src/pages/GeneratePage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  generateSchema,
  type IGenerateSchema,
} from "@/shared/schemas/generateSchema";
import { useApiQuery } from "@/features/api/react-query";
import {
  type TRngParams,
  type RngRaw,
  normalize,
  type FinalDataWithResults,
} from "@/shared/interafaces/interfaces";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { EditableNumbersTextarea } from "@/widgets/components/List/VirtualNumberList";
import Animate from "@/widgets/components/animations/Animate/Animate";

const GeneratePage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
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
  function toAnimateProps(d: FinalDataWithResults) {
    // делаем строки для блока hashes
    const hashesStrings = (d.hashes ?? []).map((h) => {
      const hex = h.modified_hash ?? h.original_hash ?? "";
      const trimmed = hex.startsWith("0x") ? hex.slice(2) : hex;
      const short = trimmed.slice(-8); // просто красиво показать хвост
      return `${h.source_name}: ${short}`;
    });

    return {
      hashes: hashesStrings, // string[]
      split: d.split ?? [], // string[][]
      pick: d.pick ?? [], // string[]
      convert: d.convert ?? [], // number[]
      sum: Number(d.sum ?? 0),
      result: Number(d.result ?? 0),
      // Animate ждёт number. Если x_factor очень большой — Number(...) может потерять точность,
      // но для отображения времени это обычно ок.
      xFactor: Number(d.x_factor ?? 0),
    };
  }
  const { data, isLoading, error, isSuccess } = useApiQuery<
    FinalDataWithResults,
    TRngParams,
    RngRaw
  >(
    ["generate"],
    {
      url: "/rng",
      params: { full_random: false, binary: false, amount: 1000 },
    },
    {
      select: normalize,
    }
  );
  if (isSuccess) {
    console.log(data);
  }

  const submit = (formData: IGenerateSchema) => {
    console.log(formData);
    reset();
  };

  return (
    <div className="fixed left-1/2 bottom-[max(16px,env(safe-area-inset-bottom))] z-50 w-[min(760px,calc(100vw-24px))] -translate-x-1/2 ">
      {data ? (
        <div className="w-full flex justify-center">
          <Animate {...toAnimateProps(data)} className="text-white" />
        </div>
      ) : null}
      <div className="mb-4 text-white">
        {isLoading ? (
          "Загрузка…"
        ) : error ? (
          <div>Ошибка: {error.message}</div>
        ) : data ? (
          <>
            <div className="mb-1">total results: {data.results.length}</div>

            <EditableNumbersTextarea
              items={data.results}
              onChange={() => {}}
              height={350}
              displaySeparator="newline"
            />
          </>
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit(submit)}
        className="pointer-events-auto w-full max-w-[720px] rounded-xl border border-[#2a313a] bg-gradient-to-b from-black/18 to-transparent bg-[#11161c] p-2.5 shadow-[0_6px_24px_rgba(0,0,0,0.35)]"
      >
        {/* Три поля ввода */}
        <div className="grid grid-cols-3 gap-3">
          {(["min", "count", "max"] as const).map((field) => (
            <div key={field} className="flex flex-col">
              <Label
                htmlFor={
                  field === "min" ? "min" : field === "max" ? "max" : "count"
                }
                className="mb-1 text-[#9aa3ad] text-sm"
              >
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
                id={field === "min" ? "min" : field === "max" ? "max" : "count"}
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

        {/* Кнопка + чекбокс */}
        <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3">
          <button
            type="submit"
            className="h-10 w-full rounded-lg border border-[#2a313a] bg-[#1a2129] font-semibold text-[#e6e7ea] transition hover:brightness-105 active:translate-y-px"
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
    </div>
  );
};

export default GeneratePage;
