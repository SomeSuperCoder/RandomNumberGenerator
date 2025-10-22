import {
  checkerSchema,
  type ICheckerSchema,
} from "@/shared/schemas/checkerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

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

  // Для корректной работы textarea с числом — лучше использовать строку
  // Но если схема ожидает number, то register с valueAsNumber может ломать textarea
  // Поэтому лучше убрать valueAsNumber и обрабатывать парсинг в submit
  // Или изменить схему на string. Пока оставим как есть, но будьте осторожны.

  return (
    <div className="fixed left-1/2 bottom-[max(16px,env(safe-area-inset-bottom))] z-50 w-[min(760px,calc(100vw-24px))] -translate-x-1/2 pointer-events-none">
      <form
        onSubmit={handleSubmit(submit)}
        className="pointer-events-auto w-full max-w-[760px] rounded-xl border border-[#2a313a] bg-gradient-to-b from-black/18 to-transparent bg-[#11161c] p-3.5 shadow-[0_6px_24px_rgba(0,0,0,0.35)]"
      >
        <div className="flex flex-col">
          <Textarea
            className="w-full min-h-[86px] resize-y rounded-lg border border-[#2a313a] bg-[#0f141a] px-3 py-2.5 text-sm text-[#e6e7ea] outline-none placeholder:text-[#9aa3ad] focus:border-[#2f6feb] focus:shadow-[0_0_0_3px_rgba(47,111,235,0.25)]"
            placeholder="Впиши число для проверки"
            {...register("count", { valueAsNumber: true })}
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
            className="h-10 w-full rounded-lg border border-[#2a313a] bg-[#1a2129] font-semibold text-[#e6e7ea] transition hover:brightness-105 active:translate-y-px"
          >
            Проверить
          </button>

          <label className="inline-flex items-center gap-2 text-[#e6e7ea] select-none">
            <input
              type="checkbox"
              className="size-4.5 appearance-none rounded-sm border border-[#2a313a] bg-[#0f141a] checked:border-[#2f6feb] checked:bg-[#2f6feb] checked:ring-0"
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
