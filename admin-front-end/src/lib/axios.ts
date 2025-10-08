import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { API_URL } from "@/config/api";

// Cria instância do axios
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor de request
api.interceptors.request.use(
  async (config) => {
    const { token, isTokenValid, refreshTokens } = useAuth.getState();

    // Para rotas que não sejam de refresh, adiciona o access token
    if (!config.url?.includes("/auth/refresh") && token?.accessToken) {
      // Verifica se o token está próximo do vencimento
      if (!isTokenValid(token.accessToken)) {
        const refreshed = await refreshTokens();

        if (refreshed) {
          const { token: newToken } = useAuth.getState();
          if (newToken?.accessToken) {
            config.headers.Authorization = `Bearer ${newToken.accessToken}`;
          }
        }
      } else {
        config.headers.Authorization = `Bearer ${token.accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se receber 401 e não for a rota de refresh, tenta renovar o token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      const { refreshTokens } = useAuth.getState();
      const refreshed = await refreshTokens();

      if (refreshed) {
        const { token: newToken } = useAuth.getState();
        if (newToken?.accessToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;
          return api(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  }
);

export { api };
