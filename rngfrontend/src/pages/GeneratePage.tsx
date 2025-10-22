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
import { EditableNumbersTextarea } from "@/widgets/components/VirtualNumberList";

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
              <input
                type="number"
                placeholder={
                  field === "min"
                    ? "Минимум"
                    : field === "max"
                    ? "Максимум"
                    : "Количество"
                }
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
