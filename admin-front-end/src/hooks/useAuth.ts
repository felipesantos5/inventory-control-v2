import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthStore {
  token: {
    accessToken: string | null;
    refreshToken: string | null;
  };
  isAuthenticated: boolean;
  setToken: (tokens: AuthTokens) => void;
  logout: () => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      token: {
        accessToken: null,
        refreshToken: null,
      },
      isAuthenticated: false,

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
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
