import { useMemo, useState } from "react";
import { useApiQuery } from "@/features/api/react-query";
import {
  type TRngParams,
  type RngRaw,
  type FinalDataWithResults,
} from "@/shared/interafaces/interfaces";
import { normalize } from "@/shared/utils/normalize";
import { EditableNumbersTextarea } from "@/widgets/components/List/VirtualNumberList";
import LotteryForm from "@/widgets/components/Forms/LotteryForm";
import { useForm } from "react-hook-form";
import {
  generateSchema,
  type IGenerateSchema,
} from "@/shared/schemas/generateSchema";
import { zodResolver } from "@hookform/resolvers/zod";

const LotteryPage = () => {
  const { watch } = useForm<IGenerateSchema>({
    resolver: zodResolver(generateSchema),
  });
  const [showResults, setShowResults] = useState(false);
  const min = watch("min");
  const max = watch("max");
  const [queryParams, setQueryParams] = useState<TRngParams>({
    full_random: false,
    binary: false,
    amount: 1000,
  });

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
      return src.map(() => Math.round(lo));
    }

    return src.map((r) => {
      const rr = Math.max(0, Math.min(1, Number(r)));
      const val = rr * span + lo;
      return Math.round(val);
    });
  }, [data?.results, min, max]);

  return (
    <div className="fixed left-1/2 bottom-[max(16px,env(safe-area-inset-bottom))] z-50 w-[min(760px,calc(100vw-24px))] -translate-x-1/2 ">
      <div className="mb-4 text-white">
        {isLoading || isFetching ? (
          "Загрузка…"
        ) : error ? (
          <div>Ошибка: {error.message}</div>
        ) : data ? (
          <>
            {data && (
              <>
                {showResults ? (
                  <EditableNumbersTextarea
                    items={scaledResults}
                    onChange={() => {}}
                    height={320}
                    displaySeparator="newline"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowResults(true)}
                    className="mt-3 w-full py-2.5 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-300 font-medium transition-all duration-200 hover:from-emerald-500/20 hover:to-teal-500/20 hover:border-emerald-400/50 hover:text-emerald-100 active:scale-[0.99] shadow-[0_4px_12px_rgba(0,255,175,0.12)]"
                  >
                    🎯 Показать выигрышную комбинацию
                  </button>
                )}
              </>
            )}
          </>
        ) : null}
        <LotteryForm
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          refetch={refetch}
          isFetching={isFetching}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default LotteryPage;
