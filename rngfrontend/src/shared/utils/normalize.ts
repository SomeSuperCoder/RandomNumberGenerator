import type {
  RngRaw,
  IFinalData,
  FinalDataWithResults,
} from "@/shared/interafaces/interfaces";

const isMeta = (x: unknown): x is Partial<IFinalData> =>
  !!x &&
  typeof x === "object" &&
  !Array.isArray(x) &&
  ("convert" in x || "sum" in x || "result" in x);

export function normalize(raw: RngRaw): FinalDataWithResults {
  const numbers = raw.filter((v): v is number => typeof v === "number");
  const metas = raw.filter(isMeta);

  const meta0 = metas[0] ?? {};

  // Извлекаем данные с fallback'ами
  const split = meta0.split ?? [];
  const pick = meta0.pick ?? [];
  const convert = meta0.convert ?? numbers;
  const sum = meta0.sum ?? numbers.reduce((a, b) => a + b, 0);
  const result = meta0.result ?? (convert.length ? sum / convert.length : 0);
  const hashes = meta0.hashes ?? [];

  // Обработка x_factor: может быть number, string или bigint
  let x_factor: bigint;
  const xRaw = meta0.x_factor;
  if (typeof xRaw === "bigint") {
    x_factor = xRaw;
  } else if (typeof xRaw === "string") {
    x_factor = BigInt(xRaw);
  } else if (typeof xRaw === "number") {
    x_factor = BigInt(Math.floor(xRaw));
  } else {
    x_factor = BigInt(0);
  }

  // Собираем все результаты из мета-объектов
  const results = metas
    .map((m) => m.result)
    .filter((v): v is number => typeof v === "number");

  return {
    split,
    pick,
    convert,
    sum,
    result,
    hashes,
    x_factor,
    results,
  };
}
