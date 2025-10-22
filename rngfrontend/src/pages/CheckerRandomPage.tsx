import {
  checkerSchema,
  type ICheckerSchema,
} from "@/shared/schemas/checkerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "./Checker.css";

const CheckerRandomPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICheckerSchema>({
    defaultValues: { count: 1, checkbox: false },
    resolver: zodResolver(checkerSchema),
    mode: "onSubmit",
  });

  const submit = (data: ICheckerSchema) => {
    console.log(data);
    reset();
  };

  return (
    <div className="checker-dock">
      <form onSubmit={handleSubmit(submit)} className="checker-form">
        <div className="field">
          <textarea
            className="checker-textarea"
            placeholder="Впиши число для проверки"
            {...register("count", { valueAsNumber: true })}
          />
          <span className="error">{errors.count?.message}</span>
        </div>

        <div className="actions">
          <button className="generate-button">Проверить</button>

          <label htmlFor="checkbox" className="checkbox-wrap">
            <input
              id="checkbox"
              type="checkbox"
              className="checkbox"
              {...register("checkbox")}
            />
            <span>Визуализация</span>
          </label>
        </div>
      </form>
    </div>
  );
};

export default CheckerRandomPage;
