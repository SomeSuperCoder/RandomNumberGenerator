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