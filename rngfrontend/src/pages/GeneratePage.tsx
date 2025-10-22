import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  generateSchema,
  type IGenerateSchema,
} from "@/shared/schemas/generateSchema";
import "./Generate.css";
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
  const submit = (data: IGenerateSchema) => {
    console.log(data);
    reset();
  };
  return (
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
  );
};

export default GeneratePage;
