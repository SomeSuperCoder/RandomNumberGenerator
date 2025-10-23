export interface IFormulaInSteps {
  hashes: string[];
  splitedHashes: [string[], string[], string[]];
  selectedParts: [string, string, string];
  selectedPartsDec: [number, number, number];
  sum: number;
  result: Float64Array;
}
export type THttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface IApiRequestConfig<TBody = unknown, TParams = unknown> {
  url: string;
  method?: THttpMethod;
  params?: TParams;
  data?: TBody;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export interface IApiError {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
}

export interface IErrorResponse {
  detail?: string;
  message?: string;
  code?: string;
  [key: string]: unknown;
}

export interface IBlockHash {
  source_name: string;
  original_hash: string;
  modified_hash: string;
}
export interface IVerifycationData {
  hashes: IBlockHash[];
  x_factor: string;
}
export interface IPipeline {
  split: string[][];
  pick: string[];
  convert: number[];
  sum: number;
  result: number;
}

export type IFinalData = IPipeline & IVerifycationData;

export type TRngParams = {
  full_random: boolean;
  binary: boolean;
  amount: number;
};

export type RngRaw = Array<number | Partial<IFinalData>>;

export type FinalDataWithResults = Omit<IFinalData, "x_factor"> & {
  x_factor: bigint;
  results: number[];
};

const isMeta = (x: unknown): x is Partial<IFinalData> =>
  !!x &&
  typeof x === "object" &&
  ("convert" in (x as any) || "sum" in (x as any) || "result" in (x as any));

export function normalize(raw: RngRaw): FinalDataWithResults {
  const numbers = raw.filter((v): v is number => typeof v === "number");
  const metas = raw.filter(isMeta) as Partial<IFinalData>[];

  const meta0 = metas[0] ?? {};

  const split = meta0.split ?? [];
  const pick = meta0.pick ?? [];
  const convert = meta0.convert ?? numbers;
  const sum = meta0.sum ?? numbers.reduce((a, b) => a + b, 0);
  const result = meta0.result ?? (convert.length ? sum / convert.length : 0);
  const hashes = meta0.hashes ?? [];

  const xRaw = (meta0.x_factor as any) ?? 0;
  const x_factor =
    typeof xRaw === "bigint"
      ? xRaw
      : BigInt(typeof xRaw === "string" ? xRaw : String(xRaw));

  const results = metas
    .map((m) => m.result)
    .filter((v): v is number => typeof v === "number");

  return { split, pick, convert, sum, result, hashes, x_factor, results };
}