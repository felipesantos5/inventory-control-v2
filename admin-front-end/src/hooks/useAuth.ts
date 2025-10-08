import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "@/config/api";
import type { DecodedToken, AuthTokens } from "@/types/auth";

interface AuthStore {
  token: {
    accessToken: string | null;
    refreshToken: string | null;
  };
  isAuthenticated: boolean;
  isRefreshing: boolean;
  setToken: (tokens: AuthTokens) => void;
  logout: () => void;
  refreshTokens: () => Promise<boolean>;
  isTokenValid: (token: string) => boolean;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: {
        accessToken: null,
        refreshToken: null,
      },
      isAuthenticated: false,
      isRefreshing: false,

      setToken: (tokens: AuthTokens) => {
        set({
          token: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          },
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          token: {
            accessToken: null,
            refreshToken: null,
          },
          isAuthenticated: false,
          isRefreshing: false,
        });
      },

      isTokenValid: (token: string): boolean => {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          // Adiciona uma margem de 5 minutos antes da expiração
          return decoded.exp * 1000 > Date.now() + 5 * 60 * 1000;
        } catch {
          return false;
        }
      },

      refreshTokens: async (): Promise<boolean> => {
        const { token, isRefreshing } = get();

        if (!token?.refreshToken || isRefreshing) {
          return false;
        }

        set({ isRefreshing: true });

        try {
          const response = await axios.post(
            `${API_URL}/auth/refresh`,
            {
              refreshToken: token.refreshToken,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const newTokens: AuthTokens = {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          };

          // Atualiza os tokens
          set({
            token: {
              accessToken: newTokens.accessToken,
              refreshToken: newTokens.refreshToken,
            },
            isAuthenticated: true,
            isRefreshing: false,
          });

          return true;
        } catch (error) {
          console.error("Erro ao renovar tokens:", error);

          // Se o refresh falhar, faz logout
          get().logout();
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

// Hook para configurar interceptors
export const useAuthInterceptors = () => {
  const { token, isTokenValid, refreshTokens } = useAuth();

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
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

    const responseInterceptor = axios.interceptors.response.use(
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

          const refreshed = await refreshTokens();

          if (refreshed) {
            const { token: newToken } = useAuth.getState();
            if (newToken?.accessToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;
              return axios(originalRequest);
            }
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup dos interceptors
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token, isTokenValid, refreshTokens]);

  // Verifica os tokens na inicialização
  useEffect(() => {
    if (token?.accessToken) {
      if (!isTokenValid(token.accessToken)) {
        // Token expirado, tenta renovar
        refreshTokens();
      }
    }
  }, []);

  // Auto-refresh periódico (opcional)
  useEffect(() => {
    if (!token?.accessToken) return;

    const checkTokenExpiry = () => {
      if (token?.accessToken && !isTokenValid(token.accessToken)) {
        refreshTokens();
      }
    };

    // Verifica a cada 10 minutos
    const interval = setInterval(checkTokenExpiry, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token, isTokenValid, refreshTokens]);
};
