import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosError,
} from "axios";
import qs from "qs";
import type {
  IApiError,
  IErrorResponse,
} from "../../shared/interafaces/interfaces";

const createApiClient = (): AxiosInstance => {
  const config: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://37.230.115.99:8090",
    timeout: 30_000,
    headers: { "Content-Type": "application/json" },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
  };

  const instance = axios.create(config);

  instance.interceptors.response.use(
    (res) => res,
    (error: AxiosError<IErrorResponse>) => {
      const normalized: IApiError = {
        status: error.response?.status ?? 0,
        message:
          error.response?.data?.detail ??
          error.response?.data?.message ??
          error.message ??
          "Network error",
        code: error.response?.data?.code,
        details: error.response?.data,
      };
      return Promise.reject(normalized);
    }
  );

  return instance;
};

export const apiClient: AxiosInstance = createApiClient();
