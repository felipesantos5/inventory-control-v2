import { api } from "@/lib/axios";
import type { TopMovementProducts } from "@/types/movement";

export const movementsService = {
  getTopMovementProducts: async (): Promise<TopMovementProducts> => {
    const response = await api.get("/reports/top-movement-products");
    return response.data;
  },
};
