import { api } from "@/lib/axios";
import type { StockBalance } from "@/types/stock";

export const stockService = {
  getStockBalance: async (): Promise<StockBalance[]> => {
    const response = await api.get("/reports/stock-balance");
    return response.data;
  },
};
