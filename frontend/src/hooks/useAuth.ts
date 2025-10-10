import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API_URL } from "@/config/api";

interface User {
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
}

interface Token {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  token: Token | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setToken: (token: Token) => void;
  refreshTokens: () => Promise<boolean>;
  isTokenValid: (token: string) => boolean;
  getUserFromToken: (token: string) => User | null;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      getUserFromToken: (token: string): User | null => {
        try {
          const decoded = jwtDecode<any>(token);

          const email = decoded.sub || decoded.email;
          const name = decoded.name || email?.split("@")[0] || "Usuário";
          const role = decoded.role || "USER";
          const isAdmin = decoded.role === "ADMIN";

          return {
            name: name,
            email: email || "",
            role: role,
            isAdmin,
          };
        } catch (error) {
          console.error("Erro ao decodificar token:", error);
          return null;
        }
      },

      isTokenValid: (token: string): boolean => {
        try {
          const decoded = jwtDecode<any>(token);
          const currentTime = Date.now() / 1000;

          // Verifica se o token não expirou (com margem de 5 minutos)
          return decoded.exp > currentTime + 300;
        } catch {
          return false;
        }
      },

      setToken: (token: Token) => {
        const user = get().getUserFromToken(token.accessToken);
        set({
          token,
          user,
          isAuthenticated: true,
        });
      },

      login: async (email: string, password: string): Promise<boolean> => {
        try {
          const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
          });

          const token: Token = response.data;
          const user = get().getUserFromToken(token.accessToken);

          set({
            token,
            user,
            isAuthenticated: true,
          });

          return true;
        } catch (error) {
          console.error("Erro no login:", error);
          return false;
        }
      },

      refreshTokens: async (): Promise<boolean> => {
        try {
          const { token } = get();
          if (!token?.refreshToken) return false;

          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken: token.refreshToken,
          });

          const newToken: Token = response.data;
          const user = get().getUserFromToken(newToken.accessToken);

          set({
            token: newToken,
            user,
            isAuthenticated: true,
          });

          return true;
        } catch (error) {
          console.error("Erro ao renovar token:", error);
          get().logout();
          return false;
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      // Só persiste token, user é recalculado a partir do token
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      // Rehydrate user quando carrega do storage
      onRehydrateStorage: () => (state) => {
        if (state?.token?.accessToken) {
          const user = state.getUserFromToken(state.token.accessToken);
          state.user = user;
        }
      },
    }
  )
);

// Hook para configurar interceptors do axios
export const useAuthInterceptors = () => {
  const { token, isTokenValid, refreshTokens, logout } = useAuth();

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
          } else {
            logout();
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token, isTokenValid, refreshTokens, logout]);
};
