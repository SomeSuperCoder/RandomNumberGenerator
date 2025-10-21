import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosError,
} from "axios";
import qs from "qs";
import type { IApiError, IErrorResponse } from "../../shared/interfaces";

const createApiClient = (): AxiosInstance => {
  const config: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api",
    timeout: 15_000,
    headers: { "Content-Type": "application/json" },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
  };

  const instance = axios.create(config);

  // Пример запроса: можно подмешать CSRF
  // instance.interceptors.request.use((cfg) => {
  //   const csrf = getCookie('csrftoken');
  //   if (csrf) cfg.headers = { ...cfg.headers, 'X-CSRFToken': csrf };
  //   return cfg;
  // });

  // Единый формат ошибок
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
