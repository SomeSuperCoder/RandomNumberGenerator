import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
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
import { EditableNumbersTextarea } from "@/widgets/components/List/VirtualNumberList";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

const LotteryPage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
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

  // читаем min/max из формы
  const min = watch("min");
  const max = watch("max");

  // параметры для ленивого запроса
  const [queryParams, setQueryParams] = useState<TRngParams>({
    full_random: false,
    binary: false,
    amount: 1000,
  });

  // ленивый запрос: выполнится только по refetch()
  const { data, isLoading, error, refetch, isFetching } = useApiQuery<
    FinalDataWithResults,
    TRngParams,
    RngRaw
  >(
    ["generate", queryParams],
    {
      url: "/rng",
      params: queryParams,
    },
    {
      select: normalize,
      enabled: false,
    }
  );

  // преобразуем массив ПЕРЕД выводом:
  // scaled = round( clamp01(r) * (hi-lo) + lo )
  const scaledResults = useMemo(() => {
    const src = data?.results ?? [];
    if (!src.length) return [];

    const a = Number(min);
    const b = Number(max);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return src;

    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    const span = hi - lo;

    if (span === 0) {
      // если min == max — все числа равны этому значению
      return src.map(() => Math.round(lo));
    }

    return src.map((r) => {
      const rr = Math.max(0, Math.min(1, Number(r))); // страховка 0..1
      const val = rr * span + lo; // r*(max-min)+min
      return Math.round(val); // округление к целому
    });
  }, [data?.results, min, max]);

  // сабмит формы: обновляем параметры и запускаем refetch
  const submit = async (formData: IGenerateSchema) => {
    const next: TRngParams = {
      ...queryParams,
      amount: Number(formData.count), // явное число
      full_random: Boolean(formData.checkbox),
    };

    setQueryParams(next);
    await refetch();
  };

  return (
    <div className="fixed left-1/2 bottom-[max(16px,env(safe-area-inset-bottom))] z-50 w-[min(760px,calc(100vw-24px))] -translate-x-1/2 ">
      <div className="mb-4 text-white">
        {isLoading || isFetching ? (
          "Загрузка…"
        ) : error ? (
          <div>Ошибка: {error.message}</div>
        ) : data ? (
          <>
            <div className="mb-1">
              total results: {data.results.length}
              <span className="ml-2 opacity-70">
                (после преобразования: {scaledResults.length})
              </span>
            </div>

            <EditableNumbersTextarea
              items={scaledResults}
              onChange={() => {}}
              height={320}
              displaySeparator="newline"
            />
          </>
        ) : null}
      </div>

      {/* Форма */}
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
            disabled={isFetching || isLoading}
          >
            {isFetching || isLoading ? "Генерация…" : "Генерировать"}
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

export default LotteryPage;
