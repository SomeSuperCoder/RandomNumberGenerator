// src/pages/GeneratePage.tsx
import { toAnimateProps } from "@/shared/utils/toAnimate";
import { useApiQuery } from "@/features/api/react-query";
import { useState } from "react";
import {
  type TRngParams,
  type RngRaw,
  type FinalDataWithResults,
} from "@/shared/interafaces/interfaces";
import { normalize } from "@/shared/utils/normalize";
import { EditableNumbersTextarea } from "@/widgets/components/List/VirtualNumberList";
import Animate from "@/widgets/components/animations/Animate/Animate";
import GenerateForm from "@/widgets/components/Forms/GenerateForm";

const GeneratePage = () => {
  const [queryParams, setQueryParams] = useState<TRngParams>({
    full_random: false,
    binary: false,
    amount: 1000,
  });

  const { data, error, refetch, isFetching } = useApiQuery<
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

  const handleGenerate = (newParams: TRngParams) => {
    setQueryParams(newParams);
    refetch();
  };

  return (
    <div className="fixed left-1/2 bottom-[max(16px,env(safe-area-inset-bottom))] z-50 w-[min(760px,calc(100vw-24px))] -translate-x-1/2">
      {data ? (
        <div className="w-full flex justify-center">
          <Animate {...toAnimateProps(data)} className="text-white" />
        </div>
      ) : null}

      <div className="mb-4 text-white">
        {isFetching ? (
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

      <GenerateForm onGenerate={handleGenerate} />
    </div>
  );
};

export default GeneratePage;
