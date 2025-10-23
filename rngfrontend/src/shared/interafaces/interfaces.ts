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

export interface BlockHash {
  source_name: string;
  original_hash: string;
  modified_hash: string;
}

export interface VerifycationData {
  hashes: BlockHash[];
  x_factor: string | number | bigint; // Go отдаёт int64 → может быть числом или строкой
}

export interface Pipeline {
  split: string[][];
  pick: string[];
  convert: number[]; // uint64 → number (в JS нет uint64)
  sum: number; // uint64 → number
  result: number; // float64 → number
}

export interface IFinalData extends VerifycationData, Pipeline {}

export type RngRaw = (number | Partial<IFinalData>)[];
export type FinalDataWithResults = IFinalData & { results: number[] };

export type TRngParams = {
  full_random: boolean;
  binary: boolean;
  amount: number;
};

export interface ILotteryFormProps {
  queryParams: TRngParams;
  setQueryParams: (params: TRngParams) => void;
  isFetching: boolean;
  isLoading: boolean;
  refetch: () => void;
}

export type AuditTest = {
  name: string;
  description: string;
  result: boolean;
};

export type AuditResponse = AuditTest[];

export interface CheckerRandomFormProps {
  onAuditSuccess: (data: AuditTest[]) => void;
  onAuditError: () => void;
}