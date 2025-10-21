import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { apiClient } from "./client";
import type { IApiRequestConfig } from "../../shared/interafaces/interfaces";

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

export async function apiRequest<TResp, TBody = unknown, TParams = unknown>(
  cfg: IApiRequestConfig<TBody, TParams>
): Promise<TResp> {
  const { url, method = "GET", params, data, headers, signal } = cfg;

  const finalHeaders = isFormData(data)
    ? headers
    : headers ?? { "Content-Type": "application/json" };

  const axiosCfg: AxiosRequestConfig<TBody> = {
    url,
    method,
    params,
    data,
    headers: finalHeaders,
    signal,
  };

  const res = await apiClient.request<TResp, AxiosResponse<TResp>, TBody>(
    axiosCfg
  );
  return res.data;
}
