import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
  type QueryFunctionContext,
} from "@tanstack/react-query";
import { apiRequest } from "./request";
import type {
  IApiError,
  IApiRequestConfig,
} from "../../shared/interafaces/interfaces";
import type { THttpMethod } from "../../shared/interafaces/interfaces";

/** GET-хук c типами для ответа и параметров */
export function useApiQuery<TData, TParams = undefined>(
  key: QueryKey,
  config: Omit<IApiRequestConfig<never, TParams>, "method" | "data"> & {
    url: string;
  },
  options?: Omit<
    UseQueryOptions<TData, IApiError, TData, QueryKey>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<TData, IApiError, TData, QueryKey>({
    queryKey: key,
    queryFn: ({ signal }: QueryFunctionContext<QueryKey>) =>
      apiRequest<TData, never, TParams>({ ...config, method: "GET", signal }),
    ...options,
  });
}

/** Мутация для GET (variables -> params) */
export function useApiGetMutation<TData, TParams>(
  config: { url: string; headers?: IApiRequestConfig["headers"] },
  options?: UseMutationOptions<TData, IApiError, TParams>
) {
  return useMutation<TData, IApiError, TParams>({
    mutationFn: (variables: TParams) =>
      apiRequest<TData, never, TParams>({
        url: config.url,
        method: "GET",
        params: variables,
        headers: config.headers,
      }),
    ...options,
  });
}

/** Мутация для методов с телом запроса (POST/PUT/PATCH/DELETE) */
export function useApiBodyMutation<TData, TBody, TParams = undefined>(
  config: {
    url: string;
    method?: Exclude<THttpMethod, "GET">;
    params?: TParams;
    headers?: IApiRequestConfig["headers"];
  },
  options?: UseMutationOptions<TData, IApiError, TBody>
) {
  const method: Exclude<THttpMethod, "GET"> = config.method ?? "POST";
  return useMutation<TData, IApiError, TBody>({
    mutationFn: (body: TBody) =>
      apiRequest<TData, TBody, TParams>({
        url: config.url,
        method,
        params: config.params,
        data: body,
        headers: config.headers,
      }),
    ...options,
  });
}
