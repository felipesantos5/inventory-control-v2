import { api } from "@/lib/axios";
import type { LowStockProduct } from "@/types/lowStock";

export const lowStockService = {
  getBelowMinStock: async (): Promise<LowStockProduct[]> => {
    const response = await api.get("/reports/below-min-stock");
    return response.data;
  },
};
