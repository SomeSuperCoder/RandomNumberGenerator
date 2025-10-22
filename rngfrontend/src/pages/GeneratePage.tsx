import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  generateSchema,
  type IGenerateSchema,
} from "@/shared/schemas/generateSchema";
import "./Generate.css";
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
  } = useForm({
    defaultValues: {
      min: 0,
      max: 0,
      count: 1,
      checkbox: false,
    },
    resolver: zodResolver(generateSchema),
    mode: "onSubmit",
  });
  const { data, isLoading, error } = useApiQuery<
    FinalDataWithResults,
    TRngParams,
    RngRaw
  >(
    ["generate"],
    {
      url: "/rng",
      params: { full_random: false, binary: false, amount: 100000 },
    },
    {
      select: normalize,
    }
  );
  console.log(data);
  if (error) console.error("API error:", error);
  console.log({ data, isLoading, error });

  const submit = (data: IGenerateSchema) => {
    console.log(data);
    reset();
  };
  return (
    <div className="generate-dock">
      <div className="mb-4 text-white">
        {isLoading
          ? "Загрузка…"
          : error
          ? `Ошибка: ${error.message}`
          : data && (
              <>
                <div className="mb-1">total results: {data.results.length}</div>
                <div className="mb-2">
                  sample result (первый): {data.results[0] ?? "—"}
                </div>

                <EditableNumbersTextarea
                  items={data.results}
                  onChange={() => {}}
                  height={320}
                  displaySeparator="newline"
                />
              </>
            )}
      </div>
      <form onSubmit={handleSubmit(submit)} className="generate-form">
        <div className="inputs">
          <div className="field">
            <input
              type="number"
              className="min"
              placeholder="Минимум"
              {...register("min", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
            <span className="error">{errors.min?.message}</span>
          </div>

          <div className="field">
            <input
              type="number"
              className="count"
              placeholder="Количество"
              {...register("count", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
            <span className="error">{errors.count?.message}</span>
          </div>

          <div className="field">
            <input
              type="number"
              className="max"
              placeholder="Максимум"
              {...register("max", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
            <span className="error">{errors.max?.message}</span>
          </div>
        </div>

        <div className="actions">
          <button className="generate-button">Генерировать</button>

          <label htmlFor="checkbox" className="checkbox-wrap">
            <input
              id="checkbox"
              type="checkbox"
              className="checkbox"
              {...register("checkbox")}
            />
            <span>Визуализация</span>
          </label>
          <span className="error">{errors.checkbox?.message}</span>
        </div>
      </form>
    </div>
  );
};

export default GeneratePage;
